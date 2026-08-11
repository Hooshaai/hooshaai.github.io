from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from api.models import Article, ModelCheckpoint, Subscriber, TelemetryLog

User = get_user_model()


class HooshaAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@hoosha.ai',
            password='Password123!',
            bio='Test Bio'
        )
        self.article = Article.objects.create(
            title='Test Article Title',
            summary='Test Summary',
            content='Test Content',
            author=self.user,
            is_published=True
        )
        self.checkpoint = ModelCheckpoint.objects.create(
            name='Test-LLM-1B',
            version='v1.0.0',
            architecture='Transformer',
            parameters_count='1B'
        )

    def test_user_registration(self):
        url = reverse('api:auth-register')
        data = {
            'username': 'newuser',
            'email': 'new@hoosha.ai',
            'password': 'Password123!',
            'password_confirm': 'Password123!',
            'bio': 'New User Bio'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

    def test_user_login(self):
        url = reverse('api:auth-login')
        data = {
            'username': 'testuser',
            'password': 'Password123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_subscribe_api(self):
        url = reverse('api:subscribe')
        data = {'email': 'subscriber@hoosha.ai'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subscriber.objects.filter(email='subscriber@hoosha.ai').exists())

    def test_article_list(self):
        url = reverse('api:article-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_checkpoint_list(self):
        url = reverse('api:checkpoint-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_telemetry_create(self):
        url = reverse('api:telemetry-list-create')
        data = {
            'event_type': 'page_view',
            'endpoint': '/home',
            'metadata': {'browser': 'Chrome'}
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(TelemetryLog.objects.filter(event_type='page_view').exists())

    def test_cuda_compile_endpoint(self):
        url = reverse('api:cuda-compile')
        data = {
            'code': '__global__ void add_kernel(float *a, float *b, float *c) { int i = threadIdx.x; c[i] = a[i] + b[i]; }',
            'arch': 'sm_80',
            'opt_level': '-O3'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('ptx_code', response.data)
        self.assertIn('add_kernel', response.data['kernel_info']['kernels'])

    def test_cfm_solve_endpoint(self):
        url = reverse('api:cfm-solve')
        data = {
            'x0': [0.0, 0.0],
            'x1': [1.0, 1.0],
            't_span': [0.0, 1.0],
            'num_steps': 20,
            'solver': 'rk4',
            'flow_type': 'linear'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['trajectory']), 21)
        self.assertIn('final_state', response.data)

    def test_rag_probe_endpoint(self):
        url = reverse('api:rag-probe')
        data = {
            'query': 'Test Article',
            'top_k': 5,
            'similarity_threshold': 0.0,
            'include_checkpoints': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data['total_matches'], 1)
        self.assertIn('synthesized_context', response.data)

    def test_swagger_docs_endpoint(self):
        schema_url = reverse('api:schema')
        schema_response = self.client.get(schema_url)
        self.assertEqual(schema_response.status_code, status.HTTP_200_OK)

        docs_url = reverse('api:swagger-ui')
        docs_response = self.client.get(docs_url)
        self.assertEqual(docs_response.status_code, status.HTTP_200_OK)

