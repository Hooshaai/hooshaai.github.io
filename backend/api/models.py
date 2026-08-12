from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class User(AbstractUser):
    """
    Custom User model supporting extended attributes for Hoosha AI platform.
    """
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('RESEARCHER', 'Researcher'),
        ('MEMBER', 'Member'),
    )

    email = models.EmailField(unique=True, help_text="User's primary email address.")
    bio = models.TextField(blank=True, default='', help_text="Short bio/description.")
    avatar_url = models.URLField(blank=True, default='', help_text="URL to profile avatar.")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f"{self.username} ({self.email})"


class Subscriber(models.Model):
    """
    Newsletter / Update Subscriber model.
    """
    email = models.EmailField(unique=True, help_text="Subscriber email address.")
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class Article(models.Model):
    """
    Blog, research paper, or announcement article.
    """
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='articles'
    )
    summary = models.TextField(blank=True, default='')
    content = models.TextField()
    cover_image = models.URLField(blank=True, default='')
    tags = models.JSONField(default=list, blank=True, help_text="List of string tags.")
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Article.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ModelCheckpoint(models.Model):
    """
    AI Model Checkpoints & Weights registry.
    """
    name = models.CharField(max_length=150, help_text="Model checkpoint name, e.g., Hoosha-LLM-7B")
    version = models.CharField(max_length=50, default="v1.0.0")
    description = models.TextField(blank=True, default='')
    architecture = models.CharField(max_length=100, help_text="e.g., Transformer, Diffusion, MoE")
    parameters_count = models.CharField(max_length=50, help_text="e.g., 7B, 70B, 1.5B")
    download_url = models.URLField(blank=True, default='')
    metrics = models.JSONField(default=dict, blank=True, help_text="Evaluation metrics e.g. {'accuracy': 0.94, 'latency_ms': 12}")
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.version})"


class TelemetryLog(models.Model):
    """
    Telemetry and system activity logs for analytics and monitoring.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='telemetry_logs'
    )
    event_type = models.CharField(max_length=100, help_text="e.g. page_view, inference, subscriber_optin")
    endpoint = models.CharField(max_length=255, blank=True, default='')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True, help_text="Contextual metadata for the event.")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.event_type}] {self.endpoint} at {self.timestamp}"
