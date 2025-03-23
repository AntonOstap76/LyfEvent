from django.contrib import admin
from .models import Event, Profile, ActivationToken, ContactMessage

admin.site.register(Event)

admin.site.register(Profile)

admin.site.register(ActivationToken)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')

