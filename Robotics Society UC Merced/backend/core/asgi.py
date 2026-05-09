# core/asgi.py — ASGI entry point for the Django application
#
# ASGI handles both HTTP and WebSocket connections.
# Before adding channels, this file only handled HTTP.
# Now it uses ProtocolTypeRouter to split traffic:
#   - HTTP requests  - normal Django views (REST API, admin, etc.)
#   - WebSocket (ws) - our ChatConsumer via channels routing

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django's ASGI app first so models are ready before routing is set up
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # All normal HTTP traffic — REST API, admin panel, everything that was already working
    'http': django_asgi_app,

    # WebSocket traffic — routed through our consumers
    # AuthMiddlewareStack makes Django's session auth available inside consumers
    # (we use JWT token auth ourselves, but this doesn't hurt to have)
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
