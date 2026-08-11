from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

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
    CUDACompileAPIView,
    CFMSolveAPIView,
    RAGProbeAPIView,
)

app_name = 'api'

urlpatterns = [
    # OpenAPI Schema & Swagger Documentation Views
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),


    # Authentication Endpoints
    path('auth/register/', RegisterAPIView.as_view(), name='auth-register'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('auth/profile/', UserProfileAPIView.as_view(), name='auth-profile'),

    # Compute & Model Engine Endpoints
    path('cuda/compile/', CUDACompileAPIView.as_view(), name='cuda-compile'),
    path('cfm/solve/', CFMSolveAPIView.as_view(), name='cfm-solve'),
    path('rag/probe/', RAGProbeAPIView.as_view(), name='rag-probe'),

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

