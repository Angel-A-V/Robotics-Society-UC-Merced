# consumers.py — WebSocket handler for real-time chat
#
# Think of this like views.py but for WebSocket connections instead of HTTP.
# Each browser that opens the chat tab gets its own ChatConsumer instance.
# All consumers watching the same channel share a "group" in the channel layer,
# so when one person sends a message it instantly reaches everyone else.

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

# NOTE: We do NOT import Django models or JWT at the top of this file.
# consumers.py is imported by daphne before Django's app registry finishes
# initializing, so top-level ORM/auth imports cause:
#   "ImproperlyConfigured: settings are not configured"
# Solution: import everything Django-related lazily inside the methods,
# where Django is fully ready by the time they execute.


class ChatConsumer(AsyncWebsocketConsumer):
    """Handles one browser's WebSocket connection to a chat channel."""

    # ── Connect ───────────────────────────────────────────────────────
    async def connect(self):
        """
        Called when a browser opens a WebSocket connection.
        We authenticate the user via JWT token (passed as a query param),
        then add this connection to the group for the requested channel.
        """
        # Grab the channel_id from the URL: ws/chat/<channel_id>/
        self.channel_id = self.scope['url_route']['kwargs']['channel_id']
        self.group_name = f'chat_{self.channel_id}'  # Group name shared by all viewers of this channel

        # Authenticate — get token from query string: ?token=<access_token>
        query_string = self.scope.get('query_string', b'').decode()
        token_str = None
        for part in query_string.split('&'):
            if part.startswith('token='):
                token_str = part.split('=', 1)[1]
                break

        if not token_str:
            # No token provided — reject the connection
            await self.close(code=4001)
            return

        # Validate the JWT token and look up the user
        self.user = await self.get_user_from_token(token_str)
        if self.user is None:
            await self.close(code=4001)
            return

        # Join the channel group — this is how Django Channels broadcasts to everyone
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # Accept the connection — browser's WebSocket.onopen fires after this
        await self.accept()

    # ── Disconnect ────────────────────────────────────────────────────
    async def disconnect(self, close_code):
        """
        Called when the browser closes the tab, navigates away, or loses connection.
        Remove this consumer from the group so it stops receiving broadcasts.
        """
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # ── Receive ───────────────────────────────────────────────────────
    async def receive(self, text_data):
        """
        Called when THIS browser sends a message through the WebSocket.
        Steps:
          1. Parse the incoming JSON
          2. Check the user is allowed to send (not pending)
          3. Save the message to the database
          4. Broadcast it to everyone in the group (including the sender)
        """
        data = json.loads(text_data)
        content = data.get('content', '').strip()

        if not content:
            return  # Ignore empty messages

        # Pending users cannot send — enforce the same rule as the REST API
        if self.user.role == 'pending':
            await self.send(text_data=json.dumps({
                'error': 'Your account is pending approval. You cannot send messages yet.'
            }))
            return

        # Save the message to the database
        message = await self.save_message(content)

        # Broadcast to the entire group — every connected browser gets this
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',           # Must match the method name below
                'id': message.id,
                'content': message.content,
                'username': self.user.username,
                'role': self.user.role,
                'created_at': message.created_at.isoformat(),
            }
        )

    # ── Chat Message (broadcast handler) ─────────────────────────────
    async def chat_message(self, event):
        """
        Called on every consumer in the group when group_send fires.
        Forwards the message down the WebSocket to this specific browser.
        This is what makes the message appear instantly for everyone.
        """
        await self.send(text_data=json.dumps({
            'id':         event['id'],
            'content':    event['content'],
            'username':   event['username'],
            'role':       event['role'],
            'created_at': event['created_at'],
        }))

    # ── Database helpers ──────────────────────────────────────────────
    # These use database_sync_to_async because Django ORM is synchronous
    # but our consumer is async — we can't call ORM directly here.

    @database_sync_to_async
    def get_user_from_token(self, token_str):
        """Validate a JWT access token and return the User, or None if invalid."""
        # Lazy imports — Django is fully initialized by the time this runs
        from rest_framework_simplejwt.tokens import AccessToken
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            token = AccessToken(token_str)
            user_id = token['user_id']
            return User.objects.get(id=user_id)
        except Exception:
            return None

    @database_sync_to_async
    def save_message(self, content):
        """Save a new Message to the database and return it."""
        # Lazy imports — safe to use ORM here, Django is fully ready
        from api.models import Channel, Message
        channel = Channel.objects.get(id=self.channel_id)
        return Message.objects.create(
            content=content,
            author=self.user,
            channel=channel,
        )