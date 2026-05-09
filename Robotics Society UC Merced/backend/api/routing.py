# routing.py — WebSocket URL routing
#
# This is the WebSocket equivalent of urls.py.
# Instead of http:// paths it maps ws:// paths to consumer classes.
# The URL pattern here must match what useSocket.js connects to.

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # ws://localhost:8000/ws/chat/1/  → connects to channel ID 1
    # ws://localhost:8000/ws/chat/2/  → connects to channel ID 2
    # The (?P<channel_id>\d+) captures the channel ID and passes it
    # to the consumer as self.scope['url_route']['kwargs']['channel_id']
    re_path(r'ws/chat/(?P<channel_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]