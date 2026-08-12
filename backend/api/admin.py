from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Subscriber, Article, ModelCheckpoint, TelemetryLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'created_at')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Hoosha Profile Information', {'fields': ('bio', 'avatar_url', 'role')}),
    )


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'subscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email',)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'author', 'is_published', 'published_at', 'created_at')
    list_filter = ('is_published', 'published_at', 'created_at')
    search_fields = ('title', 'summary', 'content', 'tags')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(ModelCheckpoint)
class ModelCheckpointAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'architecture', 'parameters_count', 'is_public', 'created_at')
    list_filter = ('architecture', 'is_public', 'created_at')
    search_fields = ('name', 'description', 'architecture', 'version')


@admin.register(TelemetryLog)
class TelemetryLogAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'endpoint', 'user', 'ip_address', 'timestamp')
    list_filter = ('event_type', 'timestamp')
    search_fields = ('event_type', 'endpoint', 'ip_address', 'metadata')
