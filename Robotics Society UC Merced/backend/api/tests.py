# ── API Smoke Tests ───────────────────────────────────────────────────────────
# Covers the paths that matter most: signing up, the role ladder, and that
# pending accounts can read the chat but not post to it.
#
# These run against a temporary database, never your real db.sqlite3.
# Run them with:   python manage.py test api

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Announcement, Channel, Message

User = get_user_model()


class AuthFlowTests(APITestCase):
    """Registering, logging in, and the first-user-becomes-admin rule."""

    def test_first_user_becomes_admin(self):
        res = self.client.post('/api/auth/register', {
            'username': 'founder', 'email': 'founder@ucmerced.edu',
            'password': 'test-pass-1234', 'confirm_password': 'test-pass-1234',
        }, format='json')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['user']['role'], 'admin')
        self.assertIn('access', res.data)

    def test_second_user_is_pending(self):
        User.objects.create_user(username='founder', password='x', role='admin')

        res = self.client.post('/api/auth/register', {
            'username': 'newbie', 'email': 'newbie@ucmerced.edu',
            'password': 'test-pass-1234', 'confirm_password': 'test-pass-1234',
        }, format='json')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['user']['role'], 'pending')

    def test_mismatched_passwords_rejected(self):
        res = self.client.post('/api/auth/register', {
            'username': 'oops', 'email': 'oops@ucmerced.edu',
            'password': 'test-pass-1234', 'confirm_password': 'different-1234',
        }, format='json')
        self.assertEqual(res.status_code, 400)

    def test_login_returns_tokens_and_me_works(self):
        User.objects.create_user(username='member1', password='test-pass-1234', role='member')

        login = self.client.post('/api/auth/login',
                                 {'username': 'member1', 'password': 'test-pass-1234'},
                                 format='json')
        self.assertEqual(login.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        me = self.client.get('/api/auth/me')
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.data['user']['username'], 'member1')

    def test_me_requires_auth(self):
        self.assertEqual(self.client.get('/api/auth/me').status_code, 401)


class PermissionTests(APITestCase):
    """The pending → member → admin ladder."""

    def setUp(self):
        self.admin   = User.objects.create_user(username='boss',   password='x', role='admin')
        self.member  = User.objects.create_user(username='mem',    password='x', role='member')
        self.pending = User.objects.create_user(username='waiting', password='x', role='pending')
        self.channel = Channel.objects.create(name='general')

    def auth_as(self, user):
        self.client.force_authenticate(user=user)

    def test_pending_can_read_chat_history(self):
        self.auth_as(self.pending)
        res = self.client.get(f'/api/chat/channels/{self.channel.id}/messages/')
        self.assertEqual(res.status_code, 200)

    def test_pending_cannot_send_messages(self):
        self.auth_as(self.pending)
        res = self.client.post(f'/api/chat/channels/{self.channel.id}/messages/send',
                               {'content': 'hello'}, format='json')
        self.assertEqual(res.status_code, 403)

    def test_member_can_send_messages(self):
        self.auth_as(self.member)
        res = self.client.post(f'/api/chat/channels/{self.channel.id}/messages/send',
                               {'content': 'hello'}, format='json')
        self.assertEqual(res.status_code, 201)

    def test_only_admin_lists_users(self):
        self.auth_as(self.member)
        self.assertEqual(self.client.get('/api/auth/users').status_code, 403)
        self.auth_as(self.admin)
        self.assertEqual(self.client.get('/api/auth/users').status_code, 200)

    def test_only_admin_creates_channels(self):
        self.auth_as(self.member)
        res = self.client.post('/api/chat/channels/create', {'name': 'nope'}, format='json')
        self.assertEqual(res.status_code, 403)

        self.auth_as(self.admin)
        res = self.client.post('/api/chat/channels/create', {'name': 'Rally Kart'}, format='json')
        self.assertEqual(res.status_code, 201)
        # Names are slugified: "Rally Kart" → "rally-kart"
        self.assertEqual(res.data['name'], 'rally-kart')

    def test_duplicate_channel_name_rejected(self):
        self.auth_as(self.admin)
        res = self.client.post('/api/chat/channels/create', {'name': 'general'}, format='json')
        self.assertEqual(res.status_code, 400)

    def test_admin_cannot_change_own_role(self):
        self.auth_as(self.admin)
        res = self.client.put(f'/api/auth/users/{self.admin.id}/role',
                              {'role': 'member'}, format='json')
        self.assertEqual(res.status_code, 400)

    def test_approving_pending_user_promotes_to_member(self):
        self.auth_as(self.admin)
        res = self.client.post(f'/api/auth/users/{self.pending.id}/approve')
        self.assertEqual(res.status_code, 200)
        self.pending.refresh_from_db()
        self.assertEqual(self.pending.role, 'member')
        self.assertTrue(self.pending.is_approved)

    def test_promoting_to_admin_grants_django_admin_access(self):
        # role='admin' alone means nothing to Django's /admin — is_staff does
        self.auth_as(self.admin)
        self.client.put(f'/api/auth/users/{self.member.id}/role',
                        {'role': 'admin'}, format='json')
        self.member.refresh_from_db()
        self.assertTrue(self.member.is_staff)
        self.assertTrue(self.member.is_superuser)


class MessageTests(APITestCase):
    """Deleting messages and toggling reactions."""

    def setUp(self):
        self.admin  = User.objects.create_user(username='boss', password='x', role='admin')
        self.author = User.objects.create_user(username='writer', password='x', role='member')
        self.other  = User.objects.create_user(username='other', password='x', role='member')
        self.channel = Channel.objects.create(name='general')
        self.message = Message.objects.create(
            content='hi', author=self.author, channel=self.channel)

    def test_author_can_delete_own_message(self):
        self.client.force_authenticate(user=self.author)
        res = self.client.delete(f'/api/chat/messages/{self.message.id}/delete')
        self.assertEqual(res.status_code, 200)
        self.message.refresh_from_db()
        self.assertTrue(self.message.is_deleted)   # Soft delete, still in the DB

    def test_other_member_cannot_delete_someone_elses_message(self):
        self.client.force_authenticate(user=self.other)
        res = self.client.delete(f'/api/chat/messages/{self.message.id}/delete')
        self.assertEqual(res.status_code, 403)

    def test_admin_can_delete_any_message(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.delete(f'/api/chat/messages/{self.message.id}/delete')
        self.assertEqual(res.status_code, 200)

    def test_deleted_messages_are_hidden_from_history(self):
        self.message.is_deleted = True
        self.message.save()
        self.client.force_authenticate(user=self.author)
        res = self.client.get(f'/api/chat/channels/{self.channel.id}/messages/')
        self.assertEqual(len(res.data), 0)

    def test_reaction_toggles_off_on_second_press(self):
        self.client.force_authenticate(user=self.other)
        url = f'/api/chat/messages/{self.message.id}/react'

        first = self.client.post(url, {'emoji': '👍'}, format='json')
        self.assertEqual(len(first.data['reactions']), 1)

        second = self.client.post(url, {'emoji': '👍'}, format='json')
        self.assertEqual(len(second.data['reactions']), 0)


class AnnouncementTests(APITestCase):
    """Only admins write announcements; everyone signed in can read them."""

    def setUp(self):
        self.admin  = User.objects.create_user(username='boss', password='x', role='admin')
        self.member = User.objects.create_user(username='mem',  password='x', role='member')

    def test_member_can_read_but_not_create(self):
        self.client.force_authenticate(user=self.member)
        self.assertEqual(self.client.get('/api/announcements/').status_code, 200)

        res = self.client.post('/api/announcements/create',
                               {'title': 'T', 'content': 'C'}, format='json')
        self.assertEqual(res.status_code, 403)

    def test_admin_create_sets_author_automatically(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post('/api/announcements/create',
                               {'title': 'Meeting', 'content': 'Friday 5pm'}, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Announcement.objects.get().author, self.admin)

    def test_pinned_announcements_sort_first(self):
        Announcement.objects.create(title='old', content='c', author=self.admin)
        Announcement.objects.create(title='pinned', content='c', author=self.admin, is_pinned=True)

        self.client.force_authenticate(user=self.member)
        res = self.client.get('/api/announcements/')
        self.assertEqual(res.data[0]['title'], 'pinned')


class PublicProfileTests(APITestCase):
    """The profile modal must never leak email addresses."""

    def test_public_profile_excludes_email(self):
        User.objects.create_user(username='subject', email='secret@ucmerced.edu',
                                 password='x', role='member')
        viewer = User.objects.create_user(username='viewer', password='x', role='member')

        self.client.force_authenticate(user=viewer)
        res = self.client.get('/api/auth/profile/subject')

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['username'], 'subject')
        self.assertNotIn('email', res.data)

    def test_unknown_username_returns_404(self):
        viewer = User.objects.create_user(username='viewer', password='x', role='member')
        self.client.force_authenticate(user=viewer)
        self.assertEqual(self.client.get('/api/auth/profile/ghost').status_code, 404)
