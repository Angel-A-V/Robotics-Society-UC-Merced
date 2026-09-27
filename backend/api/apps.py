# ── App Config ────────────────────────────────────────────────────────────────
# Registers the 'api' app. Listed in INSTALLED_APPS in core/settings.py.

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
