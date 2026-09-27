# ── Announcement Views ────────────────────────────────────────────────────────
# Everyone signed in can read announcements; only admins can write them.
#
# Ordering (pinned first, then newest) comes from the Announcement model's
# Meta class, so it does not need repeating here.

from rest_framework import generics, permissions

from ..models import Announcement
from ..permissions import IsAdmin
from ..serializers import AnnouncementSerializer


class AnnouncementListView(generics.ListAPIView):
    """GET /api/announcements/ — readable by any signed-in user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()


class AnnouncementCreateView(generics.CreateAPIView):
    """POST /api/announcements/create — admin only."""

    permission_classes = [IsAdmin]
    serializer_class = AnnouncementSerializer

    def perform_create(self, serializer):
        # Author comes from the request, never from the request body
        serializer.save(author=self.request.user)


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / DELETE /api/announcements/<id>/ — admin only."""

    permission_classes = [IsAdmin]
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()
