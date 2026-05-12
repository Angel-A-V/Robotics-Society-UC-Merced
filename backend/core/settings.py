from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ['*']  # Railway sets the host header; safe behind their proxy

INSTALLED_APPS = [
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',
    'api',
]

ASGI_APPLICATION = 'core.asgi.application'
CHANNEL_LAYERS = {'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [], 'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ── Persistent storage ────────────────────────────────────────────────────────
# Railway's filesystem is ephemeral — every code deploy wipes it.
# To survive redeploys, mount a Railway Volume at /app/data in the dashboard:
#   Service → Settings → Volumes → + New Volume → mount path: /app/data
# Once that's done, this block automatically relocates the SQLite DB and
# uploaded media into /app/data, which persists across redeploys.
# Locally (no /app/data), it falls back to the project folder as before.
PERSIST_DIR = '/app/data'
if os.path.isdir(PERSIST_DIR) and os.access(PERSIST_DIR, os.W_OK):
    # Move SQLite onto the volume
    DATABASES['default']['NAME'] = os.path.join(PERSIST_DIR, 'db.sqlite3')
    # Move uploads onto the volume
    MEDIA_ROOT_OVERRIDE = os.path.join(PERSIST_DIR, 'media')
    os.makedirs(MEDIA_ROOT_OVERRIDE, exist_ok=True)
else:
    MEDIA_ROOT_OVERRIDE = None

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = MEDIA_ROOT_OVERRIDE if MEDIA_ROOT_OVERRIDE else os.path.join(BASE_DIR, 'media')
DATA_UPLOAD_MAX_MEMORY_SIZE = 8 * 1024 * 1024

# ── CORS — hardcoded explicit allowlist + regex fallback ─────────────────────
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://robotics-society-ucmerced.angelavargas0831.workers.dev",
]
# Allow ANY *.workers.dev subdomain (handles preview deploys too)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.workers\.dev$",
    r"^https://.*\.pages\.dev$",
]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS + [
    "https://*.workers.dev",
    "https://*.pages.dev",
    "https://*.railway.app",
    "https://*.up.railway.app",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_HEADERS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

AUTH_USER_MODEL = 'api.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'