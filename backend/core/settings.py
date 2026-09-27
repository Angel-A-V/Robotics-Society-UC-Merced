# ── Django Settings ───────────────────────────────────────────────────────────
# Reads secrets from backend/.env (never committed — see .gitignore).
#
# Sections below, in order:
#   Security · Apps · Channels · Middleware · Templates · Database ·
#   Persistent storage · Passwords · Locale · Static & media · CORS ·
#   REST framework · JWT · Custom user
#
# Deployment notes:
#   - Runs under Daphne (ASGI), not WSGI, because chat needs WebSockets.
#   - CHANNEL_LAYERS uses in-memory storage, which works for a single process.
#     Running more than one worker needs Redis — see the note at that setting.

from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ['*']  # Railway sets the host header; safe behind their proxy

# ── Apps ──
# 'daphne' must come first: it overrides the runserver command so local
# development serves WebSockets too.
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

# ── Channels (WebSockets) ──
ASGI_APPLICATION = 'core.asgi.application'

# In-memory channel layer: fine for one server process, which is how this is
# deployed. It does NOT work across processes — if this is ever scaled to
# multiple workers, messages would only reach users on the same worker.
# The fix at that point is to swap this for channels_redis.
CHANNEL_LAYERS = {'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}}

# ── Middleware ──
# Order matters. CORS must be first so it can answer preflight requests, and
# WhiteNoise sits high up so it serves static files before Django routing.
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

# ── URLs & templates ──
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

# Kept for tooling that expects it; the app actually runs over ASGI.
WSGI_APPLICATION = 'core.wsgi.application'

# ── Database ──
# SQLite. The path is overridden below when a persistent volume is mounted.
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

# ── Password rules ──
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ── Locale ──
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ── Static files & uploads ──
# STATIC = Django admin's own CSS/JS. MEDIA = user uploads (avatars, chat files).
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = MEDIA_ROOT_OVERRIDE if MEDIA_ROOT_OVERRIDE else os.path.join(BASE_DIR, 'media')
# Matches MAX_UPLOAD_BYTES in api/views/uploads.py and the browser-side
# check in src/lib/config.js. Change all three together.
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

# ── REST framework ──
# Everything requires a login by default; views opt out with AllowAny.
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
}

# ── JWT lifetimes ──
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# ── Custom user model ──
# Must never change after the first migration.
AUTH_USER_MODEL = 'api.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'