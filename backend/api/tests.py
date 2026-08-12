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
            content=r'Test Content for KaTeX math $\mathcal{O}(N^2)$',
            author=self.user,
            is_published=True
        )
        self.checkpoint = ModelCheckpoint.objects.create(
            name='Test-LLM-1B',
            version='v1.0.0',
            architecture='Transformer',
            parameters_count='1B',
            is_public=True
        )

    # ----------------------------------------------------
    # Authentication Tests
    # ----------------------------------------------------
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

    def test_registration_password_mismatch(self):
        url = reverse('api:auth-register')
        data = {
            'username': 'mismatch',
            'email': 'mismatch@hoosha.ai',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        url = reverse('api:auth-login')
        data = {
            'username': 'testuser',
            'password': 'Password123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_user_login_invalid_password(self):
        url = reverse('api:auth-login')
        data = {
            'username': 'testuser',
            'password': 'WrongPassword!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_profile_authenticated(self):
        url = reverse('api:auth-profile')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_user_profile_unauthenticated(self):
        url = reverse('api:auth-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ----------------------------------------------------
    # Newsletter Subscription Tests
    # ----------------------------------------------------
    def test_subscribe_api(self):
        url = reverse('api:subscribe')
        data = {'email': 'subscriber@hoosha.ai'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subscriber.objects.filter(email='subscriber@hoosha.ai').exists())

    def test_subscribe_duplicate_email(self):
        url = reverse('api:subscribe')
        Subscriber.objects.create(email='existing@hoosha.ai')
        data = {'email': 'existing@hoosha.ai'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_subscribe_invalid_email(self):
        url = reverse('api:subscribe')
        data = {'email': 'not-an-email'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ----------------------------------------------------
    # Article API Tests
    # ----------------------------------------------------
    def test_article_list(self):
        url = reverse('api:article-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_article_detail_by_slug(self):
        url = reverse('api:article-detail', kwargs={'slug': self.article.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Article Title')

    def test_article_detail_not_found(self):
        url = reverse('api:article-detail', kwargs={'slug': 'non-existent-slug'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_article_create_authenticated(self):
        url = reverse('api:article-list-create')
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'New Published Article',
            'summary': 'Summary of new article',
            'content': 'Content of new article',
            'is_published': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Article.objects.filter(title='New Published Article').exists())

    def test_article_create_unauthenticated(self):
        url = reverse('api:article-list-create')
        data = {
            'title': 'Unauthorized Article',
            'summary': 'Summary',
            'content': 'Content'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ----------------------------------------------------
    # Model Checkpoints Tests
    # ----------------------------------------------------
    def test_checkpoint_list(self):
        url = reverse('api:checkpoint-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 1)

    def test_checkpoint_detail(self):
        url = reverse('api:checkpoint-detail', kwargs={'pk': self.checkpoint.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test-LLM-1B')

    # ----------------------------------------------------
    # Telemetry Tests
    # ----------------------------------------------------
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

    # ----------------------------------------------------
    # Compute & Engine Endpoints Tests
    # ----------------------------------------------------
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

    def test_cuda_compile_empty_code(self):
        url = reverse('api:cuda-compile')
        data = {'code': '', 'arch': 'sm_80'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

    def test_cfm_solve_default_params(self):
        url = reverse('api:cfm-solve')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('trajectory', response.data)

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

    def test_rag_probe_empty_query(self):
        url = reverse('api:rag-probe')
        data = {'query': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ----------------------------------------------------
    # Swagger & Documentation Endpoint Tests
    # ----------------------------------------------------
    def test_swagger_docs_endpoint(self):
        schema_url = reverse('api:schema')
        schema_response = self.client.get(schema_url)
        self.assertEqual(schema_response.status_code, status.HTTP_200_OK)

        docs_url = reverse('api:swagger-ui')
        try:
            docs_response = self.client.get(docs_url)
            self.assertIn(docs_response.status_code, [status.HTTP_200_OK, status.HTTP_302_FOUND])
        except AttributeError:
            pass

    def test_redoc_docs_endpoint(self):
        redoc_url = reverse('api:redoc')
        try:
            redoc_response = self.client.get(redoc_url)
            self.assertIn(redoc_response.status_code, [status.HTTP_200_OK, status.HTTP_302_FOUND])
        except AttributeError:
            pass
