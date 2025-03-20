from django.urls import re_path
from .consumers import ChatRoomConsumer, NotificationConsumer

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<chat_id>\d+)/$", ChatRoomConsumer.as_asgi()),  
    re_path(r"^ws/notifications/$", NotificationConsumer.as_asgi()), 
]