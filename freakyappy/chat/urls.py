from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    
    path("chat/<str:chat_id>/", views.chat_view, name="chat_view"),

    path("all-user-chats/", views.get_all_chats, name= "all_chats"),

    path('mark-read/<str:chat_id>/', views.mark_messages_as_read, name='mark_messages_as_read'),

    path('last-message/<str:chat_id>/', views.get_last_message, name='get_last_message'),

    path('unread-exists/', views.has_unreads, name='has_unreads'),



]