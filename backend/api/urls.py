# ── API Routes ────────────────────────────────────────────────────────────────
# Maps every /api/... path to a view. Grouped to mirror the views package:
# each group here matches one module in api/views/.
#
# Login and token refresh use SimpleJWT's built-in views — there is no custom
# code behind them.
#
# The frontend's matching list is src/lib/api.js. Change a path here and change
# it there too.

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    # ── Auth ──
    path('auth/register', views.RegisterView.as_view()),        # POST   create account
    path('auth/login',    TokenObtainPairView.as_view()),       # POST   username+password → tokens
    path('auth/refresh',  TokenRefreshView.as_view()),          # POST   refresh → new access token
    path('auth/me',       views.MeView.as_view()),              # GET    current user

    # ── User management (admin) ──
    path('auth/users',                   views.UserListView.as_view()),     # GET    all users
    path('auth/users/<int:pk>/approve',  views.ApproveUserView.as_view()),  # POST   approve pending
    path('auth/users/<int:pk>/role',     views.ChangeRoleView.as_view()),   # PUT    change role

    # ── Profile ──
    # NOTE: the <str:username> route must come last in this group, or it would
    # also swallow /auth/profile/avatar and treat "avatar" as a username.
    path('auth/profile',                 views.ProfileUpdateView.as_view()),  # PUT  update bio
    path('auth/profile/avatar',          views.ProfileAvatarView.as_view()),  # POST upload avatar
    path('auth/profile/<str:username>',  views.PublicProfileView.as_view()),  # GET  public profile

    # ── Announcements ──
    path('announcements/',            views.AnnouncementListView.as_view()),    # GET    list
    path('announcements/create',      views.AnnouncementCreateView.as_view()),  # POST   create (admin)
    path('announcements/<int:pk>/',   views.AnnouncementDetailView.as_view()),  # GET/PUT/DELETE

    # ── Chat: channels ──
    path('chat/channels/',                  views.ChannelListView.as_view()),    # GET    list
    path('chat/channels/create',            views.ChannelCreateView.as_view()),  # POST   create (admin)
    path('chat/channels/<int:pk>/delete',   views.ChannelDeleteView.as_view()),  # DELETE (admin)

    # ── Chat: messages ──
    # Live sending goes over WebSocket instead — see api/routing.py.
    path('chat/channels/<int:channel_id>/messages/',     views.MessageListView.as_view()),    # GET    history
    path('chat/channels/<int:channel_id>/messages/send', views.MessageCreateView.as_view()),  # POST   send
    path('chat/messages/<int:pk>/delete',                views.MessageDeleteView.as_view()),  # DELETE
    path('chat/messages/<int:pk>/react',                 views.ReactionToggleView.as_view()), # POST   toggle reaction

    # ── Chat: file uploads ──
    path('chat/channels/<int:channel_id>/upload', views.FileUploadView.as_view()),  # POST   attachment
]
