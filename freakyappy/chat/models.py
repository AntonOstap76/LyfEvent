from django.db import models
from django.contrib.auth.models import User
from api.models import Event

class ChatGroup(models.Model):
    chat_name = models.CharField(max_length=128, unique=True)
    users_online =models.ManyToManyField(User, related_name="online_in_groups", blank=True)
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='chat')
    participants = models.ManyToManyField(User, blank=True,  related_name='chat_groups' )
    def __str__(self):
        return self.chat_name

class GroupMessage(models.Model):
    group = models.ForeignKey(ChatGroup, related_name='chat_messages', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created"]
    def __str__(self):
        return f"Message by {self.author.username} in {self.group.chat_name}"