from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterAPIView,
    LoginAPIView,
    UserProfileAPIView,
    SubscribeAPIView,
    ArticleListCreateAPIView,
    ArticleDetailAPIView,
    CheckpointListAPIView,
    CheckpointDetailAPIView,
    TelemetryLogListCreateAPIView,
)

app_name = 'api'

urlpatterns = [
    # Authentication Endpoints
    path('auth/register/', RegisterAPIView.as_view(), name='auth-register'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('auth/profile/', UserProfileAPIView.as_view(), name='auth-profile'),

    # Subscription Endpoint
    path('subscribe/', SubscribeAPIView.as_view(), name='subscribe'),

    # Article Endpoints
    path('articles/', ArticleListCreateAPIView.as_view(), name='article-list-create'),
    path('articles/<slug:slug>/', ArticleDetailAPIView.as_view(), name='article-detail'),

    # Model Checkpoints Endpoints
    path('checkpoints/', CheckpointListAPIView.as_view(), name='checkpoint-list-create'),
    path('checkpoints/<int:pk>/', CheckpointDetailAPIView.as_view(), name='checkpoint-detail'),

    # Telemetry Log Endpoints
    path('telemetry/', TelemetryLogListCreateAPIView.as_view(), name='telemetry-list-create'),
]
