from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    
    path("chat/<str:chat_id>/", views.chat_view, name="chat_view"),

    path("all-user-chats/", views.get_all_chats, name= "all_chats"),

]