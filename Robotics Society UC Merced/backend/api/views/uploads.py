# ── File Upload View ──────────────────────────────────────────────────────────
# Chat attachments. A successful upload creates a Message row pointing at the
# saved file and broadcasts it, so the file appears in everyone's chat exactly
# like a typed message.

from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.response import Response
from rest_framework.views import APIView

from ..broadcast import broadcast_message
from ..models import Channel, Message
from ..permissions import IsMember
from ..serializers import MessageSerializer

# Keep in step with MAX_CHAT_FILE_BYTES in src/lib/config.js and with
# DATA_UPLOAD_MAX_MEMORY_SIZE in core/settings.py.
MAX_UPLOAD_BYTES = 8 * 1024 * 1024   # 8MB


def categorize_upload(content_type):
    """Bucket a MIME type into the category the frontend renders from.

    'image'    → shown inline, opens in the lightbox
    'pdf'      → download card with a PDF icon
    'document' → generic download card
    """
    if content_type.startswith('image/'):
        return 'image'
    if content_type == 'application/pdf':
        return 'pdf'
    return 'document'


class FileUploadView(APIView):
    """POST /api/chat/channels/<channel_id>/upload — multipart, field name 'file'."""

    permission_classes = [IsMember]

    def post(self, request, channel_id):
        uploaded = request.FILES.get('file')
        if not uploaded:
            return Response({'error': 'No file provided'}, status=400)

        # Checked here as well as in the browser, since the browser check is
        # only a convenience and can be bypassed.
        if uploaded.size > MAX_UPLOAD_BYTES:
            return Response({'error': 'File too large. Maximum size is 8MB.'}, status=400)

        file_type = categorize_upload(uploaded.content_type or '')

        # One folder per channel keeps media/ navigable as the chat grows.
        # default_storage.save() renames on collision, so two uploads with the
        # same filename never overwrite each other.
        save_path = default_storage.save(
            f'chat_uploads/channel_{channel_id}/{uploaded.name}',
            uploaded,
        )

        # Store a relative URL (/media/...), not an absolute one. The frontend
        # prefixes it with API_BASE. Keeping it relative means moving to cloud
        # storage later is a config change, not a database migration.
        file_url = settings.MEDIA_URL + save_path

        message = Message.objects.create(
            content='',            # File-only message; a caption would go here
            author=request.user,
            channel=Channel.objects.get(pk=channel_id),
            file_url=file_url,
            file_name=uploaded.name,
            file_type=file_type,
        )

        serialized = MessageSerializer(message).data

        # Without this, other people in the channel would have to refresh
        # before the file showed up.
        broadcast_message(channel_id, serialized, request.user)

        return Response(serialized, status=201)
