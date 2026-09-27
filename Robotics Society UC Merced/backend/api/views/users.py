# ── User Management Views ─────────────────────────────────────────────────────
# Admin-only. Approving new sign-ups and changing roles.

from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsAdmin
from ..serializers import UserSerializer

User = get_user_model()

VALID_ROLES = ('pending', 'member', 'admin')


class UserListView(generics.ListAPIView):
    """GET /api/auth/users — every user, newest sign-up first."""

    permission_classes = [IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('-date_joined')


class ApproveUserView(APIView):
    """POST /api/auth/users/<id>/approve — turn a pending account into a member."""

    permission_classes = [IsAdmin]

    def post(self, request, pk):
        user = User.objects.get(pk=pk)

        if user.role != 'pending':
            return Response({'error': 'User is not pending'}, status=400)

        user.role = 'member'
        user.is_approved = True
        # Members get portal access but NOT the Django admin site — that is
        # what is_staff controls, so it stays off.
        user.is_staff = False
        user.is_superuser = False
        user.save()

        return Response({'user': UserSerializer(user).data})


class ChangeRoleView(APIView):
    """PUT /api/auth/users/<id>/role — promote or demote a user."""

    permission_classes = [IsAdmin]

    def put(self, request, pk):
        new_role = request.data.get('role')

        if new_role not in VALID_ROLES:
            return Response({'error': 'Invalid role'}, status=400)

        # Guard rail: an admin cannot demote themselves, which would otherwise
        # let the last admin lock everyone out of the admin panel.
        if str(pk) == str(request.user.pk):
            return Response({'error': 'Cannot change your own role'}, status=400)

        user = User.objects.get(pk=pk)
        user.role = new_role
        user.is_approved = new_role != 'pending'

        # Keep Django's own permission flags in step with our custom role.
        # Django's /admin only lets in users with is_staff=True, and our
        # role field means nothing to it — so we set both by hand here.
        # Without this, a site admin could use the portal but not /admin.
        is_admin = new_role == 'admin'
        user.is_staff = is_admin
        user.is_superuser = is_admin

        user.save()
        return Response({'user': UserSerializer(user).data})
