# api/urls.py — maps URL paths to view functions

from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # Built-in login view — accepts username+password, returns JWT tokens
    TokenRefreshView,      # Built-in token refresh view — returns new access token from refresh token
)
from . import views

urlpatterns = [
    # ── Auth ──
    path('auth/register', views.RegisterView.as_view()),         # POST — create account
    path('auth/login', TokenObtainPairView.as_view()),           # POST — login, returns tokens
    path('auth/refresh', TokenRefreshView.as_view()),            # POST — get new access token
    path('auth/me', views.MeView.as_view()),                     # GET  — current user info

    # ── Admin: User management ──
    path('auth/users', views.UserListView.as_view()),                    # GET  — all users
    path('auth/users/<int:pk>/approve', views.ApproveUserView.as_view()),# POST — approve user
    path('auth/users/<int:pk>/role', views.ChangeRoleView.as_view()),    # PUT  — change role

    # ── Announcements ──
    path('announcements/', views.AnnouncementListView.as_view()),        # GET  — list all
    path('announcements/create', views.AnnouncementCreateView.as_view()),# POST — create (admin)
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view()), # GET/PUT/DELETE

    # ── Chat ──
    path('chat/channels/', views.ChannelListView.as_view()),             # GET  — list channels
    path('chat/channels/<int:channel_id>/messages/', views.MessageListView.as_view()),   # GET
    path('chat/channels/<int:channel_id>/messages/send', views.MessageCreateView.as_view()), # POST
    path('chat/messages/<int:pk>/delete', views.MessageDeleteView.as_view()), # DELETE
    path('chat/messages/<int:pk>/react', views.ReactionToggleView.as_view()),    # POST — toggle reaction
    path('chat/channels/<int:channel_id>/upload', views.FileUploadView.as_view()), # POST — upload file
    path('chat/channels/create', views.ChannelCreateView.as_view()),     # POST — create channel (admin)
    path('chat/channels/<int:pk>/delete', views.ChannelDeleteView.as_view()), # DELETE — delete channel (admin)

    # ── Profile ──
    path('auth/profile', views.ProfileUpdateView.as_view()),              # PUT  — update bio
    path('auth/profile/avatar', views.ProfileAvatarView.as_view()),       # POST — upload avatar
    path('auth/profile/<str:username>', views.PublicProfileView.as_view()),# GET  — public profile
]