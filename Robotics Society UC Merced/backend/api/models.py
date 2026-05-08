# models.py — defines your database tables

from django.db import models
from django.contrib.auth.models import AbstractUser  # Django's built-in user with hashed passwords

class User(AbstractUser):
    """
    Custom user model extending Django's built-in AbstractUser.
    AbstractUser already gives us: username, email, password (hashed), is_active, date_joined, last_login
    We add: role and is_approved
    """

    # Role choices — stored as short strings in the database
    ROLE_CHOICES = [
        ('pending', 'Pending'),   # Just registered, waiting for approval
        ('member', 'Member'),     # Approved, can participate
        ('admin', 'Admin'),       # Full access
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='pending'         # Everyone starts as pending
    )

    is_approved = models.BooleanField(default=False)  # Admins flip this to True to approve users

    # Convenience properties — makes code more readable elsewhere
    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_member(self):
        return self.role in ('member', 'admin')  # Admins can do everything members can

    @property
    def is_pending(self):
        return self.role == 'pending'

    def __str__(self):
        return f"{self.username} [{self.role}]"


class Announcement(models.Model):
    """Announcements created by admins, visible to all logged-in users."""

    title = models.CharField(max_length=200)
    content = models.TextField()
    is_pinned = models.BooleanField(default=False)   # Pinned announcements show at top
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,   # If admin is deleted, keep the announcement but set author to null
        null=True,
        related_name='announcements'
    )
    created_at = models.DateTimeField(auto_now_add=True)  # Set automatically when created
    updated_at = models.DateTimeField(auto_now=True)      # Updated every time the record is saved

    class Meta:
        ordering = ['-is_pinned', '-created_at']  # Pinned first, then newest

    def __str__(self):
        return self.title


class Channel(models.Model):
    """Chat channels (like Discord channels — e.g. #general, #projects)."""

    name = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=256, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.name}"


class Message(models.Model):
    """A single chat message in a channel."""

    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,    # If user is deleted, delete their messages too
        related_name='messages'
    )
    channel = models.ForeignKey(
        Channel,
        on_delete=models.CASCADE,    # If channel is deleted, delete all its messages
        related_name='messages'
    )
    is_deleted = models.BooleanField(default=False)  # Soft delete — hide but don't remove from DB
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']   # Oldest messages first

    def __str__(self):
        return f"{self.author.username}: {self.content[:50]}"