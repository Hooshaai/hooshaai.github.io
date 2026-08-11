from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Subscriber, Article, ModelCheckpoint, TelemetryLog

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'bio', 'avatar_url', 'role', 'created_at')
        read_only_fields = ('id', 'created_at')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_confirm', 'bio', 'role')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ('id', 'email', 'is_active', 'subscribed_at')
        read_only_fields = ('id', 'subscribed_at')

    def create(self, validated_data):
        email = validated_data.get('email')
        subscriber, created = Subscriber.objects.get_or_create(
            email=email,
            defaults={'is_active': True}
        )
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
        return subscriber


class ArticleSerializer(serializers.ModelSerializer):
    author_details = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Article
        fields = (
            'id', 'title', 'slug', 'author', 'author_details',
            'summary', 'content', 'cover_image', 'tags',
            'is_published', 'published_at', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')


class ModelCheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelCheckpoint
        fields = (
            'id', 'name', 'version', 'description', 'architecture',
            'parameters_count', 'download_url', 'metrics', 'is_public',
            'created_at'
        )
        read_only_fields = ('id', 'created_at')


class TelemetryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelemetryLog
        fields = ('id', 'user', 'event_type', 'endpoint', 'ip_address', 'metadata', 'timestamp')
        read_only_fields = ('id', 'timestamp')
