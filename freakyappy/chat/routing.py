# from django.urls import path
# from . import consumers

# websocket_urlpatterns = [

#     path("ws/chat/<chat_name>/", consumers.ChatRoomConsumer.as_asgi()),

     
# ]

from django.urls import re_path
from .consumers import ChatRoomConsumer

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<chat_id>\d+)/$", ChatRoomConsumer.as_asgi()),  # Use chat_id
]