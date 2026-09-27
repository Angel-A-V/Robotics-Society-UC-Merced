# ── Views Package ─────────────────────────────────────────────────────────────
# views.py used to be one 450-line file. It is now split by feature, one module
# per area of the API:
#
#   auth.py          register, /me
#   users.py         admin user management (approve, change role)
#   announcements.py club announcements
#   channels.py      chat channel list / create / delete
#   messages.py      chat history, send, delete, reactions
#   uploads.py       chat file attachments
#   profile.py       bio, avatar, public profile
#
# Related files that are NOT views:
#   ../permissions.py  IsMember / IsAdmin
#   ../broadcast.py    pushing updates over WebSocket
#   ../consumers.py    the live chat WebSocket handler
#
# Everything is re-exported here, so `from . import views` followed by
# `views.RegisterView` keeps working exactly as before and api/urls.py did not
# need to change.

from .announcements import (
    AnnouncementCreateView,
    AnnouncementDetailView,
    AnnouncementListView,
)
from .auth import MeView, RegisterView
from .channels import ChannelCreateView, ChannelDeleteView, ChannelListView
from .messages import (
    MessageCreateView,
    MessageDeleteView,
    MessageListView,
    ReactionToggleView,
)
from .profile import ProfileAvatarView, ProfileUpdateView, PublicProfileView
from .uploads import FileUploadView
from .users import ApproveUserView, ChangeRoleView, UserListView

__all__ = [
    # Auth
    'RegisterView', 'MeView',
    # User management
    'UserListView', 'ApproveUserView', 'ChangeRoleView',
    # Announcements
    'AnnouncementListView', 'AnnouncementCreateView', 'AnnouncementDetailView',
    # Channels
    'ChannelListView', 'ChannelCreateView', 'ChannelDeleteView',
    # Messages
    'MessageListView', 'MessageCreateView', 'MessageDeleteView', 'ReactionToggleView',
    # Uploads
    'FileUploadView',
    # Profile
    'ProfileUpdateView', 'ProfileAvatarView', 'PublicProfileView',
]
