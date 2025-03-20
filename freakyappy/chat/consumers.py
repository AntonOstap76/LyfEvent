
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from .models import ChatGroup, GroupMessage, MessageReadStatus
from asgiref.sync import async_to_sync
import json


class ChatRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        
        # Check if the user is authenticated
        if not self.user.is_authenticated:
            self.close()  # Close the WebSocket connection for anonymous users
            return
        
        # Get the chat_id from the URL
        self.chat_id = int(self.scope["url_route"]["kwargs"]["chat_id"])
        
        # Fetch the chat group using the chat_id (SYNCHRONOUSLY)
        self.chat = get_object_or_404(ChatGroup, id=self.chat_id)
        
        # Join the group synchronously
        async_to_sync(self.channel_layer.group_add)(str(self.chat.id), self.channel_name)

        # Add the user to online users if they are not already present
        if not self.chat.users_online.filter(id=self.user.id).exists():
            self.chat.users_online.add(self.user)
            self.chat.save()
            self.online_counter()  # Update the count

        self.accept()

    def disconnect(self, close_code):
        if self.user and self.user.is_authenticated:
            self.chat.users_online.remove(self.user)
            self.chat.save()
            self.online_counter()  # Update the count

    def receive(self, text_data):
        if not self.user.is_authenticated:
            return 
        
        text_data_json = json.loads(text_data)
        text = text_data_json.get("text", "")

        # Save message synchronously
        message = GroupMessage.objects.create(
            text=text,
            author=self.user,
            group=self.chat
        )

        for user in self.chat.participants.all():
            MessageReadStatus.objects.create(
                user=user,
                message=message,
                is_read=False  # Default to False
    )

        # Find users who are chat participants but **not online**
        offline_users = self.chat.participants.exclude(
            id__in=self.chat.users_online.values_list("id", flat=True)
        )
        
        # Notify only offline users
        for user in offline_users:
            self.notify_unread(user, self.chat)

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



    def notify_unread(self, user, chat):

        event = {
            "type": "new_notification",
            "chat_id": chat.id
        }

        # Send notification to the user's notification WebSocket
        async_to_sync(self.channel_layer.group_send)(
            f"user_{user.id}", event
        )



class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            self.close()  # Close the WebSocket connection for anonymous users
            return
        

        self.group_name = f"user_{self.user.id}"

        # Join the group synchronously
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

        self.accept()
        print(f"User {self.user} connected to notifications.")

    def disconnect(self, close_code):
        if self.user:
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)
            print(f"User {self.user} disconnected from notifications.")

    def receive(self, text_data):
        pass


    def new_notification(self, event):
        # Get unread count SYNCHRONOUSLY
        self.send(text_data=json.dumps({
            "type": "notification",
            "chat_id": event["chat_id"]
        }))

