from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Article, ModelCheckpoint, Subscriber, TelemetryLog

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed initial demonstration data for Hoosha AI backend.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...')

        # Admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@hoosha.ai',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'bio': 'Hoosha AI Platform Administrator & Principal Researcher'
            }
        )
        if created:
            admin_user.set_password('admin12345')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created default admin user (admin / admin12345)'))

        # Sample Subscriber
        Subscriber.objects.get_or_create(email='researcher@example.com')
        Subscriber.objects.get_or_create(email='dev@hoosha.ai')

        # Sample Articles
        Article.objects.get_or_create(
            title='Introducing Hoosha-LLM: Open High-Efficiency Reasoning',
            defaults={
                'author': admin_user,
                'summary': 'Next-generation open architecture optimizing latency and reasoning capability for complex logic tasks.',
                'content': 'Hoosha AI is proud to announce the release of our flagship model family, designed with dynamic sparse attention and multi-head routing...',
                'cover_image': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                'tags': ['LLM', 'AI', 'Open Source', 'Architecture'],
                'is_published': True
            }
        )

        Article.objects.get_or_create(
            title='Optimizing Transformer Latency on Apple Silicon & Edge Devices',
            defaults={
                'author': admin_user,
                'summary': 'Benchmarking hardware-aware quantization and MPS matrix multiplication acceleration.',
                'content': 'Deploying deep learning models on edge devices requires balancing precision with inference speed. Here is our breakdown of MPS optimizations...',
                'cover_image': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
                'tags': ['Edge AI', 'Optimization', 'Apple Silicon', 'Metal'],
                'is_published': True
            }
        )

        # Sample Model Checkpoints
        ModelCheckpoint.objects.get_or_create(
            name='Hoosha-7B-Instruct',
            version='v1.2.0',
            defaults={
                'description': 'Instruction-tuned 7 billion parameter model trained on multi-step reasoning benchmarks.',
                'architecture': 'Decoder-only Transformer',
                'parameters_count': '7B',
                'download_url': 'https://huggingface.co/hoosha-ai/hoosha-7b-instruct',
                'metrics': {'MMLU': 78.4, 'GSM8K': 82.1, 'latency_ms': 18.5},
                'is_public': True
            }
        )

        ModelCheckpoint.objects.get_or_create(
            name='Hoosha-Vision-v1',
            version='v1.0.0',
            defaults={
                'description': 'Multimodal vision-language model capable of high-resolution diagram parsing.',
                'architecture': 'ViT + LLM Fusion',
                'parameters_count': '3.2B',
                'download_url': 'https://huggingface.co/hoosha-ai/hoosha-vision-v1',
                'metrics': {'DocVQA': 89.2, 'FPS': 45},
                'is_public': True
            }
        )

        # Sample Telemetry Log
        TelemetryLog.objects.create(
            user=admin_user,
            event_type='system_seed',
            endpoint='/api/v1/seed/',
            metadata={'action': 'initial_seed_completed'}
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Hoosha AI data.'))
