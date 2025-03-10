from django.db import models
from django.contrib.auth.models import User


from django.core.exceptions import ValidationError


import uuid
from django.conf import settings


class ActivationToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="activation_token")
    token = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Activation Token for {self.user.username}"
    

class Event(models.Model):
    host=models.ForeignKey(User,on_delete=models.CASCADE, null=True, related_name='events')
    title = models.CharField(max_length=255,verbose_name="Event Title")
    description = models.TextField(verbose_name="Event Description")
    updated=models.DateTimeField(auto_now=True)
    created=models.DateTimeField(auto_now_add=True)
    capacity = models.IntegerField(verbose_name="Event Capacity",blank=False)
    category = models.CharField(max_length=50, verbose_name="Event Category")
    image = models.ImageField(upload_to="event_images", blank=True, null=True, default="event_images/default.jpg")
    participants = models.ManyToManyField(User, related_name="joined_event", blank=True)
    date = models.DateTimeField(verbose_name="Event Date")
    location = models.CharField(max_length=255, verbose_name="Event Location")


    


    def save(self, *args, **kwargs):
        if not self.pk and self.host.events.count() >= 8:  # Only check limit when creating (not updating)
            raise ValidationError("You can only create up to 8 events.")
        super().save(*args, **kwargs)
   
    def __str__(self):
        return f"{self.title} - Event"
    
    def has_space(self):
        return self.participants.count() < self.maxPeople

    def is_user_joined(self, user):
        return self.participants.filter(id=user.id).exists()
    
    
    
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="profile_images/avatars", blank=True, null=True)
    fact1 = models.TextField(blank=True, null=True)
    fact2 = models.TextField(blank=True, null=True)
    fact3 = models.TextField(blank=True, null=True)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="following", blank=True)



