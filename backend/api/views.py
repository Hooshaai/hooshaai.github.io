from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .models import Subscriber, Article, ModelCheckpoint, TelemetryLog
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    SubscriberSerializer,
    ArticleSerializer,
    ModelCheckpointSerializer,
    TelemetryLogSerializer,
)

User = get_user_model()


class RegisterAPIView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Returns user details along with initial JWT access and refresh tokens.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            'message': 'User registered successfully.',
            'user': user_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(TokenObtainPairView):
    """
    API endpoint for user login. Returns JWT access and refresh tokens along with user info.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            username = request.data.get('username') or request.data.get('email')
            try:
                user = User.objects.get(username=username) if User.objects.filter(username=username).exists() else User.objects.get(email=username)
                user_data = UserSerializer(user).data
                response.data['user'] = user_data
            except User.DoesNotExist:
                pass
        return response


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve or update current authenticated user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class SubscribeAPIView(generics.CreateAPIView):
    """
    API endpoint to register new subscribers for newsletters & platform updates.
    """
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        return Response({
            'message': 'Successfully subscribed to Hoosha AI updates.',
            'subscriber': SubscriberSerializer(subscriber).data
        }, status=status.HTTP_201_CREATED)


class ArticleListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint to list published articles or create a new article.
    Supports searching by title/summary/content and ordering.
    """
    serializer_class = ArticleSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary', 'content', 'tags']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        queryset = Article.objects.all()
        # Non-staff users only see published articles
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_published=True)
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to retrieve, update, or delete a specific article by slug or ID.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class CheckpointListAPIView(generics.ListCreateAPIView):
    """
    API endpoint to list public model checkpoints or register a new checkpoint.
    """
    serializer_class = ModelCheckpointSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'architecture', 'description', 'version']
    ordering_fields = ['created_at', 'name', 'version']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = ModelCheckpoint.objects.all()
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_public=True)
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class CheckpointDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to retrieve, update, or delete a model checkpoint.
    """
    queryset = ModelCheckpoint.objects.all()
    serializer_class = ModelCheckpointSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TelemetryLogListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint to capture telemetry events or inspect system logs (staff).
    """
    serializer_class = TelemetryLogSerializer

    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return TelemetryLog.objects.all()
        elif self.request.user and self.request.user.is_authenticated:
            return TelemetryLog.objects.filter(user=self.request.user)
        return TelemetryLog.objects.none()

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        # Extract IP address from request metadata
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = self.request.META.get('REMOTE_ADDR')

        serializer.save(user=user, ip_address=ip)
