from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import Event, Profile
from chat.models import ChatGroup
from django.db.models.signals import post_save, pre_save
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models.signals import post_migrate
from django.contrib.auth.models import User

@receiver(m2m_changed, sender=Event.participants.through)
def update_chat_participants(sender, instance, action, reverse, model, pk_set, **kwargs):
    if reverse:
        return  # We don't need to handle reverse changes (e.g., changes to `User`)

    # Ensure the chat exists for this event
    try:
        chat = ChatGroup.objects.get(event=instance)
    except ChatGroup.DoesNotExist:
        return

    if action == 'post_add':  # When participants are added to the event
        chat.participants.add(*pk_set)  # Add new participants to the chat
    elif action == 'post_remove':  # When participants are removed from the event
        chat.participants.remove(*pk_set)  # Remove participants from the chat
    elif action == 'pre_clear':  # When all participants are cleared from the event
        chat.participants.clear()  # Clear all participants in the chat


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Create a Profile instance when a new User is created
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Save the Profile when the User instance is saved (to update any changes if needed)
    instance.profile.save()

