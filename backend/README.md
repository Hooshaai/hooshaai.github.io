# Hoosha AI - Django REST Framework Backend

Production-grade Django REST Framework backend service for Hoosha AI, providing full authentication, newsletter subscription, article publishing, model checkpoint management, and telemetry logging endpoints.

---

## Directory Architecture

```
backend/
├── manage.py
├── requirements.txt
├── README.md
├── db.sqlite3
├── hoosha_backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── api/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py          # User, Subscriber, Article, ModelCheckpoint, TelemetryLog
    ├── serializers.py     # DRF Serializers for models & authentication
    ├── views.py           # RegisterAPIView, LoginAPIView, SubscribeAPIView, ArticleListCreateAPIView, CheckpointListAPIView, etc.
    ├── urls.py            # API routing configuration
    └── management/
        └── commands/
            └── seed_data.py # Initial demo data seeder
```

---

## Setup & Installation Instructions

### 1. Prerequisites
Ensure you have Python 3.9 or higher installed:
```bash
python3 --version
```

### 2. Create and Activate a Virtual Environment
Navigate to the backend directory:
```bash
cd /Users/tahamajs/Documents/tmp/hooshaai.github.io/backend
```

Create a virtual environment:
```bash
python3 -m venv venv
```

Activate the virtual environment:
- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```
- **Windows:**
  ```cmd
  venv\Scripts\activate
  ```

### 3. Install Dependencies
Install all required packages from `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## Database Migrations & Initial Setup

### 1. Generate Model Migrations
To create migration files for model changes:
```bash
python manage.py makemigrations api
```

### 2. Apply Database Migrations
To create or update database tables in SQLite (`db.sqlite3`):
```bash
python manage.py migrate
```

### 3. Seed Initial Demo Data (Optional)
To populate sample articles, model checkpoints, subscribers, and an admin user:
```bash
python manage.py seed_data
```
> Default Admin credentials created by `seed_data`:
> - **Username**: `admin`
> - **Password**: `admin12345`

### 4. Create an Admin Superuser (Manual)
To create a custom administrative user manually:
```bash
python manage.py createsuperuser
```

---

## Starting the Django Development Server

Run the development server on **port 8000**:

```bash
python manage.py runserver 8000
```

To make it accessible across local network interfaces (e.g. `0.0.0.0`):
```bash
python manage.py runserver 0.0.0.0:8000
```

Access points:
- **API Base URL**: [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/)
- **Django Admin Interface**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## API Reference & Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/` | Register new user & obtain JWT tokens | No |
| `POST` | `/api/v1/auth/login/` | Authenticate user & retrieve JWT access/refresh tokens | No |
| `POST` | `/api/v1/auth/refresh/` | Refresh expired JWT access token | No |
| `GET/PUT/PATCH` | `/api/v1/auth/profile/` | Retrieve/Update current user profile | Yes (JWT) |
| `POST` | `/api/v1/subscribe/` | Subscribe email to newsletter updates | No |
| `GET` | `/api/v1/articles/` | List published articles (Search: `?search=term`) | No |
| `POST` | `/api/v1/articles/` | Create a new article | Yes (JWT) |
| `GET/PUT/DELETE` | `/api/v1/articles/<slug>/` | Retrieve, update or delete article by slug | Read: No / Write: Yes |
| `GET` | `/api/v1/checkpoints/` | List AI model checkpoints | No |
| `POST` | `/api/v1/checkpoints/` | Register new model checkpoint | Yes (JWT) |
| `GET/PUT/DELETE` | `/api/v1/checkpoints/<id>/` | Retrieve, update or delete checkpoint by ID | Read: No / Write: Yes |
| `POST` | `/api/v1/telemetry/` | Log telemetry / analytics event | No |
| `GET` | `/api/v1/telemetry/` | List telemetry logs | Yes (Staff/Authenticated) |

---

## Environment Variables (Optional `.env` Configuration)

Create a `.env` file in the backend root directory for custom production overrides:

```env
DJANGO_SECRET_KEY=your-production-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,hoosha.ai
```
