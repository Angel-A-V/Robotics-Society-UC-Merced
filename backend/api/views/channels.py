# ── Channel Views ─────────────────────────────────────────────────────────────
# Listing channels (anyone signed in) and creating or deleting them (admins).

import re

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Channel
from ..permissions import IsAdmin
from ..serializers import ChannelSerializer


def slugify_channel_name(name):
    """Turn free text into a channel slug: "Rally Kart!" → "rally-kart".

    Anything that is not a lowercase letter, digit or hyphen becomes a hyphen,
    runs of hyphens collapse, and leading/trailing hyphens are trimmed.
    """
    slug = re.sub(r'[^a-z0-9-]', '-', name.lower()).strip('-')
    return re.sub(r'-+', '-', slug)


class ChannelListView(generics.ListAPIView):
    """GET /api/chat/channels/ — every channel."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChannelSerializer
    queryset = Channel.objects.all()


class ChannelCreateView(APIView):
    """POST /api/chat/channels/create — admin only. Body: { name, description }"""

    permission_classes = [IsAdmin]

    def post(self, request):
        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()

        if not name:
            return Response({'error': 'Channel name is required.'}, status=400)

        slug = slugify_channel_name(name)

        # Channel.name is unique, so check first to return a readable message
        # rather than a database integrity error.
        if Channel.objects.filter(name=slug).exists():
            return Response({'error': f'A channel named #{slug} already exists.'}, status=400)

        channel = Channel.objects.create(name=slug, description=description)
        return Response(ChannelSerializer(channel).data, status=201)


class ChannelDeleteView(APIView):
    """DELETE /api/chat/channels/<id>/delete — admin only.

    Permanent, and it takes every message in the channel with it (the Message
    model's channel FK cascades). The frontend confirms before calling this.
    """

    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            channel = Channel.objects.get(pk=pk)
        except Channel.DoesNotExist:
            return Response({'error': 'Channel not found.'}, status=404)

        name = channel.name
        channel.delete()
        return Response({'deleted': name})
