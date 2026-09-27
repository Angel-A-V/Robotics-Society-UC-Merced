# ── Auth Views ────────────────────────────────────────────────────────────────
# Registering and identifying the current user.
#
# Logging in and refreshing tokens are handled by SimpleJWT's own built-in
# views, wired up directly in api/urls.py — there is nothing custom to add.

from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(APIView):
    """POST /api/auth/register — create a new account."""

    permission_classes = [permissions.AllowAny]   # No login required, obviously

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        # Issue tokens immediately so the user is logged in straight after
        # signing up, instead of being bounced to the login form.
        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserSerializer(user).data,
            'access':  str(refresh.access_token),   # Short-lived, sent with each request
            'refresh': str(refresh),                # Long-lived, used to mint new access tokens
        }, status=status.HTTP_201_CREATED)


class MeView(APIView):
    """GET /api/auth/me — the logged-in user.

    The frontend calls this on page load to check a stored token is still
    valid, and on a timer so a role change (pending → member) shows up
    without needing a reload.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})
