# serializers.py — converts Python objects to/from JSON for the API

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Announcement, Channel, Message

User = get_user_model()   # Gets our custom User model


class UserSerializer(serializers.ModelSerializer):
    """Serializes user data for API responses. Never exposes password."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_approved', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']  # These can't be set via API


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


class MessageSerializer(serializers.ModelSerializer):
    """Serializes chat messages with author info."""

    username = serializers.CharField(source='author.username', read_only=True)
    role = serializers.CharField(source='author.role', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'content', 'username', 'role', 'channel', 'created_at']
        read_only_fields = ['id', 'username', 'role', 'created_at']


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name', 'description']