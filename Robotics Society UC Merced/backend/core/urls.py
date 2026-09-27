# ── Root URL Configuration ────────────────────────────────────────────────────
# Only three things are served over HTTP:
#   /admin/  Django's built-in admin site (is_staff users only)
#   /api/    the REST API — see api/urls.py
#   /media/  uploaded avatars and chat attachments
#
# WebSocket routes are separate and live in api/routing.py, reached through
# core/asgi.py rather than this file.

from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # Django refuses to serve media itself when DEBUG=False, so this does it
    # explicitly. Fine for this deployment's traffic; if uploads ever move to
    # cloud storage (S3, R2), this route goes away.
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
