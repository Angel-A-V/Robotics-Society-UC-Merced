# ── Broadcast Helpers ─────────────────────────────────────────────────────────
# Pushes updates to everyone watching a chat channel over WebSocket.
#
# Why this file exists: the REST views (file upload, reactions) need to notify
# connected browsers, but the socket handling lives in consumers.py. Without
# these helpers, other users would only see an upload or a reaction after a
# page refresh.
#
# The payload keys here must stay in step with what consumers.py sends and
# what src/hooks/useSocket.js expects on the other end.

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def group_name_for(channel_id):
    """All browsers viewing one channel share this channel-layer group."""
    return f'chat_{channel_id}'


def _send(channel_id, payload):
    async_to_sync(get_channel_layer().group_send)(group_name_for(channel_id), payload)


def broadcast_message(channel_id, message, author, reactions=None):
    """Send a newly created message to everyone in the channel.

    `message` is a serialized Message dict. Called after a file upload —
    messages typed into the chat box are broadcast by the consumer itself.
    """
    _send(channel_id, {
        'type':       'chat_message',   # Routed to ChatConsumer.chat_message
        'id':         message['id'],
        'content':    message['content'],
        'username':   author.username,
        'role':       author.role,
        # avatar_url must be included, or the photo flickers on and off as
        # REST history and live socket messages alternate in the list.
        'avatar_url': author.avatar_url,
        'created_at': message['created_at'],
        'file_url':   message['file_url'],
        'file_name':  message['file_name'],
        'file_type':  message['file_type'],
        'reactions':  reactions or [],
    })


def broadcast_reaction_update(channel_id, message_id, reactions):
    """Tell everyone a message's reactions changed, so nobody has to refresh."""
    _send(channel_id, {
        'type':       'reaction_update',   # Routed to ChatConsumer.reaction_update
        'message_id': message_id,
        'reactions':  reactions,
    })
