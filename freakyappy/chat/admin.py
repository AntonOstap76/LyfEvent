from django.contrib import admin
from .models import GroupMessage, ChatGroup, MessageReadStatus

admin.site.register(GroupMessage)
admin.site.register(ChatGroup)
admin.site.register(MessageReadStatus)