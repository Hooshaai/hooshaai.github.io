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


class CUDACompileSerializer(serializers.Serializer):
    code = serializers.CharField(
        required=True,
        allow_blank=False,
        help_text="CUDA C/C++ source code containing global kernels or inline device functions."
    )
    arch = serializers.CharField(
        required=False,
        default="sm_80",
        help_text="Target NVIDIA Compute Capability GPU architecture (e.g. sm_75, sm_80, sm_86, sm_90)."
    )
    opt_level = serializers.CharField(
        required=False,
        default="-O3",
        help_text="Optimization level flag (-O0, -O1, -O2, -O3)."
    )
    nvcc_flags = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
        help_text="Additional custom flags passed directly to nvcc compiler."
    )

    def validate_code(self, value):
        if not value.strip():
            raise serializers.ValidationError("CUDA source code cannot be empty or whitespace.")
        return value

    def validate_arch(self, value):
        import re
        if not re.match(r'^(sm_\d+|compute_\d+)$', value):
            raise serializers.ValidationError("Invalid GPU architecture format (e.g. sm_80, compute_80).")
        return value

    def validate_opt_level(self, value):
        if value not in ['-O0', '-O1', '-O2', '-O3', '-Ofast']:
            raise serializers.ValidationError("Invalid optimization flag. Allowed values: -O0, -O1, -O2, -O3, -Ofast.")
        return value


class CFMSolveSerializer(serializers.Serializer):
    x0 = serializers.ListField(
        child=serializers.FloatField(),
        required=False,
        default=lambda: [0.0, 0.0],
        help_text="Initial state vector x(0) at starting time t0."
    )
    x1 = serializers.ListField(
        child=serializers.FloatField(),
        required=False,
        default=lambda: [1.0, 1.0],
        help_text="Target state vector x(1) at ending time t1."
    )
    t_span = serializers.ListField(
        child=serializers.FloatField(),
        required=False,
        default=lambda: [0.0, 1.0],
        help_text="Time interval bounds [t_start, t_end]."
    )
    num_steps = serializers.IntegerField(
        required=False,
        default=50,
        min_value=2,
        max_value=1000,
        help_text="Number of ODE solver discrete integration steps."
    )
    solver = serializers.ChoiceField(
        choices=['euler', 'rk4', 'dopri5'],
        default='rk4',
        help_text="Numerical ODE integration algorithm."
    )
    flow_type = serializers.ChoiceField(
        choices=['linear', 'harmonic', 'gaussian_vector_field'],
        default='linear',
        help_text="Continuous Normalizing Flow velocity field trajectory model."
    )
    sigma_min = serializers.FloatField(
        required=False,
        default=0.01,
        min_value=0.0,
        max_value=1.0,
        help_text="Minimum noise variance threshold for CFM schedule."
    )

    def validate_t_span(self, value):
        if len(value) != 2:
            raise serializers.ValidationError("t_span must contain exactly 2 numbers: [t_start, t_end].")
        if value[0] >= value[1]:
            raise serializers.ValidationError("t_span start time must be less than end time.")
        return value


class RAGProbeSerializer(serializers.Serializer):
    query = serializers.CharField(
        required=True,
        allow_blank=False,
        help_text="Natural language query or probe text for semantic vector search."
    )
    top_k = serializers.IntegerField(
        required=False,
        default=5,
        min_value=1,
        max_value=50,
        help_text="Maximum number of relevant document chunks to return."
    )
    similarity_threshold = serializers.FloatField(
        required=False,
        default=0.0,
        min_value=0.0,
        max_value=1.0,
        help_text="Minimum relevance similarity score threshold (0.0 to 1.0)."
    )
    include_checkpoints = serializers.BooleanField(
        required=False,
        default=True,
        help_text="Include AI Model Checkpoints in search pool alongside articles."
    )

    def validate_query(self, value):
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("Query text cannot be empty or whitespace.")
        return stripped


