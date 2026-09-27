# ── Message Views ─────────────────────────────────────────────────────────────
# Reading history, sending, deleting and reacting.
#
# Note the split in who can do what: pending accounts can READ everything but
# cannot send or react. That is why the read view uses IsAuthenticated while
# the write views use IsMember.
#
# Live messages arrive over WebSocket (consumers.py). These endpoints cover
# history and the actions the socket does not handle.

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..broadcast import broadcast_reaction_update
from ..models import Channel, Message, Reaction
from ..permissions import IsMember
from ..serializers import MessageSerializer, ReactionSerializer


class MessageListView(generics.ListAPIView):
    """GET /api/chat/channels/<channel_id>/messages/ — channel history."""

    permission_classes = [permissions.IsAuthenticated]   # Pending users may read
    serializer_class = MessageSerializer

    def get_queryset(self):
        # Soft-deleted messages stay in the database but are never served
        return Message.objects.filter(
            channel_id=self.kwargs['channel_id'],
            is_deleted=False,
        )


class MessageCreateView(generics.CreateAPIView):
    """POST /api/chat/channels/<channel_id>/messages/send — members only.

    The chat box sends over WebSocket instead; this is the REST fallback.
    """

    permission_classes = [IsMember]
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        channel = Channel.objects.get(pk=self.kwargs['channel_id'])
        serializer.save(author=self.request.user, channel=channel)


class MessageDeleteView(APIView):
    """DELETE /api/chat/messages/<id>/delete — your own message, or any if admin."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        message = Message.objects.get(pk=pk)

        if message.author != request.user and not request.user.is_admin:
            return Response({'error': 'Permission denied'}, status=403)

        # Soft delete — hidden from the API but kept in the database, so a
        # deletion can be investigated or undone later.
        message.is_deleted = True
        message.save()

        return Response({'message': 'Deleted'})


class ReactionToggleView(APIView):
    """POST /api/chat/messages/<id>/react — add or remove an emoji reaction.

    Toggling: reacting with an emoji you already used removes it. Returns the
    message's full updated reaction list, and pushes the same list to every
    other connected browser.
    """

    permission_classes = [IsMember]   # Pending users cannot react

    def post(self, request, pk):
        emoji = request.data.get('emoji', '').strip()
        if not emoji:
            return Response({'error': 'emoji is required'}, status=400)

        message = Message.objects.get(pk=pk)

        # The (message, user, emoji) unique constraint means there is at most
        # one of these to find.
        existing = Reaction.objects.filter(
            message=message, user=request.user, emoji=emoji
        ).first()

        if existing:
            existing.delete()
        else:
            Reaction.objects.create(message=message, user=request.user, emoji=emoji)

        reactions = ReactionSerializer(message.reactions.all(), many=True).data

        # Everyone else sees the change instantly instead of on next refresh
        broadcast_reaction_update(message.channel_id, message.id, reactions)

        return Response({'reactions': reactions})
