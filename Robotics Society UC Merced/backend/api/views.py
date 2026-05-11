from django.shortcuts import render

# Create your views here.
# views.py — the logic for each API endpoint

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken   # For generating JWT tokens
from django.contrib.auth import get_user_model
from .models import Announcement, Channel, Message, Reaction
from .serializers import (
    UserSerializer, RegisterSerializer,
    AnnouncementSerializer, ChannelSerializer, MessageSerializer, ReactionSerializer
)

User = get_user_model()


# ─── Custom Permission Classes ─────────────────────────────────────────────────

class IsMember(permissions.BasePermission):
    """Only approved members (and admins) can use this endpoint."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_member

class IsAdmin(permissions.BasePermission):
    """Only admins can use this endpoint."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


# ─── Auth Views ────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    """POST /api/auth/register — Create a new user account."""
    permission_classes = [permissions.AllowAny]   # Anyone can register (no login needed)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)  # Pass incoming JSON to serializer

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()   # Creates the user in the database

        # Generate JWT tokens so the user is logged in immediately after registering
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,        # Return user data
            'access': str(refresh.access_token),      # Short-lived token for API requests
            'refresh': str(refresh),                  # Long-lived token to get new access tokens
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    """GET /api/auth/me — Get the currently logged-in user's data."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})


# ─── Admin: User Management ─────────────────────────────────────────────────────

class UserListView(generics.ListAPIView):
    """GET /api/auth/users — List all users (admin only)."""
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('-date_joined')  # Newest first


class ApproveUserView(APIView):
    """POST /api/auth/users/<id>/approve — Approve a pending user (admin only)."""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        user = User.objects.get(pk=pk)   # Get user by ID, 404 if not found

        if user.role != 'pending':
            return Response({'error': 'User is not pending'}, status=400)

        user.role = 'member'
        user.is_approved = True
        # is_staff not needed for members — only admins get Django admin access
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return Response({'user': UserSerializer(user).data})


class ChangeRoleView(APIView):
    """PUT /api/auth/users/<id>/role — Change a user's role (admin only)."""
    permission_classes = [IsAdmin]

    def put(self, request, pk):
        new_role = request.data.get('role')

        if new_role not in ('pending', 'member', 'admin'):
            return Response({'error': 'Invalid role'}, status=400)

        if str(pk) == str(request.user.pk):
            return Response({'error': 'Cannot change your own role'}, status=400)

        user = User.objects.get(pk=pk)
        user.role = new_role
        user.is_approved = new_role != 'pending'

        # Sync Django's built-in permission flags with our custom role.
        # Django admin at /admin ONLY lets in users where is_staff=True.
        # Our custom role='admin' does not automatically set this — we have to do it manually.
        # Without this sync, website admins can use the portal but can't log into /admin.
        if new_role == 'admin':
            user.is_staff = True        # Required to log into Django admin panel
            user.is_superuser = True    # Required to see/edit all models in Django admin
        else:
            # If demoted away from admin, revoke Django admin access too
            user.is_staff = False
            user.is_superuser = False

        user.save()
        return Response({'user': UserSerializer(user).data})


# ─── Announcements ─────────────────────────────────────────────────────────────

class AnnouncementListView(generics.ListAPIView):
    """GET /api/announcements/ — All logged-in users can view announcements."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()   # Ordered by Meta class setting


class AnnouncementCreateView(generics.CreateAPIView):
    """POST /api/announcements/ — Only admins can create announcements."""
    permission_classes = [IsAdmin]
    serializer_class = AnnouncementSerializer

    def perform_create(self, serializer):
        # Automatically set the author to the currently logged-in admin
        serializer.save(author=self.request.user)


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/announcements/<id>/ — Admin can edit or delete."""
    permission_classes = [IsAdmin]
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()


# ─── Chat ──────────────────────────────────────────────────────────────────────

class ChannelListView(generics.ListAPIView):
    """GET /api/chat/channels/ — List all channels."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChannelSerializer
    queryset = Channel.objects.all()


class MessageListView(generics.ListAPIView):
    """GET /api/chat/channels/<id>/messages/ — Get messages in a channel."""
    permission_classes = [permissions.IsAuthenticated]   # Anyone logged in can READ (pending too)
    serializer_class = MessageSerializer

    def get_queryset(self):
        # Only return messages for the specific channel from the URL
        return Message.objects.filter(
            channel_id=self.kwargs['channel_id'],
            is_deleted=False
        )


class MessageCreateView(generics.CreateAPIView):
    """POST /api/chat/channels/<id>/messages/ — Only members can SEND messages."""
    permission_classes = [IsMember]   # Pending users blocked here
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        channel = Channel.objects.get(pk=self.kwargs['channel_id'])
        serializer.save(author=self.request.user, channel=channel)


class MessageDeleteView(APIView):
    """DELETE /api/chat/messages/<id>/ — Delete own message, or any message if admin."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        message = Message.objects.get(pk=pk)

        # Only the author or an admin can delete a message
        if message.author != request.user and not request.user.is_admin:
            return Response({'error': 'Permission denied'}, status=403)

        message.is_deleted = True   # Soft delete — hides it but keeps it in the DB
        message.save()
        return Response({'message': 'Deleted'})

# ─── Reactions ─────────────────────────────────────────────────────────────────

class ReactionToggleView(APIView):
    """POST /api/chat/messages/<id>/react — Toggle an emoji reaction on a message.
    If the user has already reacted with this emoji, the reaction is removed.
    If not, it is added. Returns the updated reaction list for the message.
    """
    permission_classes = [IsMember]   # Pending users cannot react

    def post(self, request, pk):
        emoji = request.data.get('emoji', '').strip()
        if not emoji:
            return Response({'error': 'emoji is required'}, status=400)

        message = Message.objects.get(pk=pk)
        # Try to get existing reaction — if found, delete it (toggle off)
        existing = Reaction.objects.filter(message=message, user=request.user, emoji=emoji).first()
        if existing:
            existing.delete()
        else:
            Reaction.objects.create(message=message, user=request.user, emoji=emoji)

        # Build updated reaction list
        reactions = ReactionSerializer(message.reactions.all(), many=True).data

        # Broadcast the reaction update to ALL WebSocket clients in the channel
        # so other users see the new/removed reaction instantly without refreshing.
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        group_name = f'chat_{message.channel_id}'

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'reaction_update',       # Handled by new handler in consumers.py
                'message_id': message.id,
                'reactions':  reactions,
            }
        )

        return Response({'reactions': reactions})


# ─── File Upload ───────────────────────────────────────────────────────────────

class FileUploadView(APIView):
    """POST /api/chat/channels/<channel_id>/upload — Upload a file and create a message.
    Accepts multipart/form-data with a 'file' field.
    Saves the file to MEDIA_ROOT and creates a Message with the file URL.
    Max file size: 8MB (enforced here + in settings via DATA_UPLOAD_MAX_MEMORY_SIZE).
    """
    permission_classes = [IsMember]

    def post(self, request, channel_id):
        import os
        from django.conf import settings
        from django.core.files.storage import default_storage

        uploaded = request.FILES.get('file')
        if not uploaded:
            return Response({'error': 'No file provided'}, status=400)

        # Enforce 8MB size limit — reasonable for free hosting
        max_bytes = 8 * 1024 * 1024
        if uploaded.size > max_bytes:
            return Response({'error': 'File too large. Maximum size is 8MB.'}, status=400)

        # Determine file type category for frontend rendering decisions
        content_type = uploaded.content_type or ''
        if content_type.startswith('image/'):
            file_type = 'image'
        elif content_type == 'application/pdf':
            file_type = 'pdf'
        else:
            file_type = 'document'

        # Save to media/chat_uploads/channel_X/ — clean structure for future cloud migration
        channel_dir = f'chat_uploads/channel_{channel_id}/'
        save_path = default_storage.save(
            channel_dir + uploaded.name,
            uploaded
        )
        # Store as a clean relative URL: /media/chat_uploads/channel_1/foo.png
        # The frontend will prefix this with the Django server base URL (API_BASE).
        # Storing relative paths (not full URLs) makes cloud storage migration easier later —
        # just change the prefix, not all stored records.
        file_url = settings.MEDIA_URL + save_path

        # Create a Message record linking to the file
        channel = Channel.objects.get(pk=channel_id)
        message = Message.objects.create(
            content='',            # No text content for file messages
            author=request.user,
            channel=channel,
            file_url=file_url,
            file_name=uploaded.name,
            file_type=file_type,
        )

        # Broadcast the file message to all WebSocket clients in this channel.
        # Without this, other users would need to refresh to see the uploaded file.
        # We import channel layer here lazily (same pattern as consumers.py).
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        import json

        serialized = MessageSerializer(message).data
        channel_layer = get_channel_layer()
        group_name = f'chat_{channel_id}'

        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type':       'chat_message',
                'id':         serialized['id'],
                'content':    serialized['content'],
                'username':   request.user.username,
                'role':       request.user.role,
                'avatar_url': request.user.avatar_url,   # ← include avatar in file uploads too
                'created_at': serialized['created_at'],
                'file_url':   serialized['file_url'],
                'file_name':  serialized['file_name'],
                'file_type':  serialized['file_type'],
                'reactions':  [],
            }
        )

        return Response(serialized, status=201)

# ─── Profile Views ─────────────────────────────────────────────────────────────

class ProfileUpdateView(APIView):
    """PUT /api/auth/profile — Update the logged-in user's bio.
    Avatar upload is handled separately by ProfileAvatarView.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        bio = request.data.get('bio', user.bio)

        # Cap bio at 300 chars
        user.bio = bio[:300]
        user.save()
        return Response(UserSerializer(user).data)


class ProfileAvatarView(APIView):
    """POST /api/auth/profile/avatar — Upload a profile picture.
    Accepts multipart/form-data with a 'avatar' image file (max 4MB).
    Stores file in media/avatars/ and saves the relative URL on the user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        import os
        from django.conf import settings
        from django.core.files.storage import default_storage

        uploaded = request.FILES.get('avatar')
        if not uploaded:
            return Response({'error': 'No file provided'}, status=400)

        # Avatar size limit — smaller than chat uploads since it's profile art
        max_bytes = 4 * 1024 * 1024
        if uploaded.size > max_bytes:
            return Response({'error': 'Avatar too large. Maximum size is 4MB.'}, status=400)

        # Only allow image types for avatars
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if uploaded.content_type not in allowed_types:
            return Response({'error': 'Only JPG, PNG, GIF, or WebP images are allowed.'}, status=400)

        # Save to media/avatars/user_<id>_<filename>
        ext = uploaded.name.rsplit('.', 1)[-1].lower()
        safe_name = f'user_{request.user.id}.{ext}'
        save_path = default_storage.save(f'avatars/{safe_name}', uploaded)
        avatar_url = settings.MEDIA_URL + save_path

        request.user.avatar_url = avatar_url
        request.user.save()

        return Response({'avatar_url': avatar_url})


class PublicProfileView(APIView):
    """GET /api/auth/profile/<username> — Get public profile info for any user.
    Used when clicking a username in chat to view their profile modal.
    Returns safe public fields only — never email or sensitive data.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username):
        try:
            target = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        return Response({
            'id':         target.id,
            'username':   target.username,
            'role':       target.role,
            'bio':        target.bio,
            'avatar_url': target.avatar_url,
            'date_joined': target.date_joined,
        })


# ─── Channel Management (Admin only) ──────────────────────────────────────────

class ChannelCreateView(APIView):
    """POST /api/chat/channels/create — Create a new chat channel.
    Admin only. Body: { name, description }
    Name is slugified automatically (spaces → hyphens, lowercase).
    """
    permission_classes = [IsAdmin]

    def post(self, request):
        import re
        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()

        if not name:
            return Response({'error': 'Channel name is required.'}, status=400)

        # Sanitize: lowercase, replace spaces/special chars with hyphens
        slug = re.sub(r'[^a-z0-9-]', '-', name.lower()).strip('-')
        slug = re.sub(r'-+', '-', slug)   # collapse multiple hyphens

        if Channel.objects.filter(name=slug).exists():
            return Response({'error': f'A channel named #{slug} already exists.'}, status=400)

        channel = Channel.objects.create(name=slug, description=description)
        return Response(ChannelSerializer(channel).data, status=201)


class ChannelDeleteView(APIView):
    """DELETE /api/chat/channels/<id>/delete — Delete a channel and all its messages.
    Admin only. This is permanent — use with care.
    """
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            channel = Channel.objects.get(pk=pk)
        except Channel.DoesNotExist:
            return Response({'error': 'Channel not found.'}, status=404)

        name = channel.name
        channel.delete()   # Cascades to messages via on_delete=CASCADE in Message model
        return Response({'deleted': name})