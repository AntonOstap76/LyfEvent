from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from .models import ChatGroup, GroupMessage
from asgiref.sync import async_to_sync
import json

class ChatRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        
        # Get the chat_id from the URL
        self.chat_id = int(self.scope["url_route"]["kwargs"]["chat_id"])
        
        # Fetch the chat group using the chat_id
        self.chat = get_object_or_404(ChatGroup, id=self.chat_id)
        
        # Add the user to the group in the channel layer
        async_to_sync(self.channel_layer.group_add)(
            str(self.chat.id),  # Use chat ID for the group name
            self.channel_name
        )

        # Add the user to the online users if they are not already present
        if not self.chat.users_online.filter(id=self.user.id).exists():
            self.chat.users_online.add(self.user)
            self.chat.save()
            self.online_counter()

        self.accept()

    def disconnect(self, close_code):
        if self.user:
            self.chat.users_online.remove(self.user)
            self.chat.save()
            self.online_counter()  # Update the online user count if necessary

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text = text_data_json.get("text", "")

        # Save the new message to the database
        message = GroupMessage.objects.create(
            text=text,
            author=self.user,
            group=self.chat
        )

        # Send the new message to the group
        event = {
            "type": "chat_message_handler",
            "message": {
                "id": message.id,
                "author_username": message.author.username,
                "text": message.text,
            },
        }
        async_to_sync(self.channel_layer.group_send)(str(self.chat.id), event)

    def chat_message_handler(self, event):
        self.send(text_data=json.dumps(event))

    def online_counter(self):
        # Get the online count
        online_count = self.chat.users_online.count()

        event = {
            "type": "online_count_handler",
            "online_count": online_count,
        }
        async_to_sync(self.channel_layer.group_send)(str(self.chat.id), event)

    def online_count_handler(self, event):
        # Send the online count to the frontend
        self.send(text_data=json.dumps(event))
