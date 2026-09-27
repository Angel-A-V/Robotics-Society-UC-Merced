"""
One-time script to create a superuser if one doesn't exist.
Run via: python create_admin.py
Called from Railway build command.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = os.environ.get("SUPERUSER_NAME", "admin")
email    = os.environ.get("SUPERUSER_EMAIL", "admin@ucmerced.edu")
password = os.environ.get("SUPERUSER_PASS", "password")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created.")
else:
    print(f"Superuser '{username}' already exists, skipping.")