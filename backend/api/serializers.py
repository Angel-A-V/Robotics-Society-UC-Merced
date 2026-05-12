# serializers.py — converts Python objects to/from JSON for the API

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Announcement, Channel, Message, Reaction

User = get_user_model()   # Gets our custom User model


class UserSerializer(serializers.ModelSerializer):
    """Serializes user data for API responses. Never exposes password."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_approved', 'date_joined', 'last_login', 'avatar_url', 'bio']
        read_only_fields = ['id', 'date_joined', 'last_login']


class RegisterSerializer(serializers.ModelSerializer):
    """Used for the registration endpoint — handles password hashing."""

    password = serializers.CharField(
        write_only=True,       # Password is accepted as input but never returned in responses
        min_length=8,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate_username(self, value):
        """Reject duplicate usernames with a clear error message."""
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already taken. Please choose another.")
        return value

    def validate_email(self, value):
        """Reject duplicate emails — prevents multiple accounts with the same address."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with that email already exists.")
        return value

    def validate(self, data):
        """Check that the two passwords match."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """Create the user. Django's create_user hashes the password automatically."""
        validated_data.pop('confirm_password')  # Remove this field before creating the user

        # Check if this is the first user ever — if so, make them admin
        is_first_user = User.objects.count() == 0

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],   # create_user hashes this automatically
            role='admin' if is_first_user else 'pending',
            is_approved=is_first_user,
            is_staff=is_first_user,    # Gives Django admin panel access to first user
            is_superuser=is_first_user,
        )
        return user


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializes announcements, shows author's username instead of their ID."""

    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'is_pinned', 'author_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author_name', 'created_at', 'updated_at']


class ReactionSerializer(serializers.ModelSerializer):
    """Serializes a single reaction — used inside MessageSerializer."""
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Reaction
        fields = ['id', 'emoji', 'username']
        read_only_fields = ['id', 'username']


class MessageSerializer(serializers.ModelSerializer):
    """Serializes chat messages with author info, reactions, and file attachments."""
    username   = serializers.CharField(source='author.username', read_only=True)
    role       = serializers.CharField(source='author.role', read_only=True)
    avatar_url = serializers.CharField(source='author.avatar_url', read_only=True, allow_null=True)
    # Nested reactions — returns list of {id, emoji, username} objects
    reactions = ReactionSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'content', 'username', 'role', 'avatar_url', 'channel',
            'file_url', 'file_name', 'file_type',   # File attachment fields
            'reactions',                              # Emoji reactions
            'created_at',
        ]
        read_only_fields = ['id', 'username', 'role', 'avatar_url', 'created_at', 'reactions']


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name', 'description']