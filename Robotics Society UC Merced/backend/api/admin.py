from django.contrib import admin
from .models import User, Channel, Message, Announcement

admin.site.register(User)
admin.site.register(Channel)
admin.site.register(Message)
admin.site.register(Announcement)