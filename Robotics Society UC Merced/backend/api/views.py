from django.shortcuts import render

# Create your views here.
# views.py — the logic for each API endpoint

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken   # For generating JWT tokens
from django.contrib.auth import get_user_model
from .models import Announcement, Channel, Message
from .serializers import (
    UserSerializer, RegisterSerializer,
    AnnouncementSerializer, ChannelSerializer, MessageSerializer
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