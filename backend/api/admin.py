# ── Django Admin ──────────────────────────────────────────────────────────────
# Registers the models with Django's built-in admin site at /admin.
#
# Only users with is_staff=True can get in. That flag is kept in step with our
# own `role` field by ChangeRoleView — see api/views/users.py.
#
# These are plain registrations with no customisation: the portal's own Admin
# tab is the intended way to manage users, and /admin is the raw fallback.
# To customise a table here, swap admin.site.register(Model) for a ModelAdmin.

from django.contrib import admin

from .models import Announcement, Channel, Message, Reaction, User

admin.site.register(User)
admin.site.register(Channel)
admin.site.register(Message)
admin.site.register(Announcement)
admin.site.register(Reaction)
