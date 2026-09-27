# ── Profile Views ─────────────────────────────────────────────────────────────
# Editing your own bio and avatar, and viewing anyone's public profile.

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import UserSerializer

User = get_user_model()

# Keep in step with MAX_AVATAR_BYTES and MAX_BIO_LENGTH in src/lib/config.js.
MAX_AVATAR_BYTES = 4 * 1024 * 1024   # 4MB
MAX_BIO_LENGTH = 300                 # Also the User.bio max_length

ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']


class ProfileUpdateView(APIView):
    """PUT /api/auth/profile — update your own bio. Avatars go to the view below."""

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        # Truncate rather than reject, so a slightly-too-long bio still saves
        user.bio = request.data.get('bio', user.bio)[:MAX_BIO_LENGTH]
        user.save()
        return Response(UserSerializer(user).data)


class ProfileAvatarView(APIView):
    """POST /api/auth/profile/avatar — multipart upload, field name 'avatar'."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        uploaded = request.FILES.get('avatar')
        if not uploaded:
            return Response({'error': 'No file provided'}, status=400)

        if uploaded.size > MAX_AVATAR_BYTES:
            return Response({'error': 'Avatar too large. Maximum size is 4MB.'}, status=400)

        # Avatars are displayed with <img>, so only accept real image types
        if uploaded.content_type not in ALLOWED_AVATAR_TYPES:
            return Response(
                {'error': 'Only JPG, PNG, GIF, or WebP images are allowed.'},
                status=400,
            )

        # Name the file after the user id so their avatars stay identifiable
        # in media/avatars/ instead of being a pile of random filenames.
        ext = uploaded.name.rsplit('.', 1)[-1].lower()
        save_path = default_storage.save(f'avatars/user_{request.user.id}.{ext}', uploaded)

        # Relative URL, same reasoning as chat uploads — see views/uploads.py
        avatar_url = settings.MEDIA_URL + save_path

        request.user.avatar_url = avatar_url
        request.user.save()

        return Response({'avatar_url': avatar_url})


class PublicProfileView(APIView):
    """GET /api/auth/profile/<username> — public profile for the chat modal.

    Deliberately hand-built rather than using UserSerializer: that serializer
    includes the email address, which must not be exposed to other members.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username):
        try:
            target = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        return Response({
            'id':          target.id,
            'username':    target.username,
            'role':        target.role,
            'bio':         target.bio,
            'avatar_url':  target.avatar_url,
            'date_joined': target.date_joined,
        })
