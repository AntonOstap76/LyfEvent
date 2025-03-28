from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import ChatGroupSerializer, GroupMessageSerializer
from rest_framework import status
from .models import ChatGroup, GroupMessage, MessageReadStatus
from api.models import Event
from django.shortcuts import get_object_or_404

from urllib.parse import unquote


from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import ChatGroup
from .serializers import GroupMessageSerializer, ChatGroupSerializer

@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def chat_view(request, chat_id):
    try:
        # Use chat_id instead of chat_name
        chat_group = ChatGroup.objects.get(id=chat_id)

    except ChatGroup.DoesNotExist:
        return Response({"error": "Chat group not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Retrieve last 30 messages
        chat_messages = chat_group.chat_messages.all().order_by('created')
        # Pass the request context to the serializer
        serializer_chat = GroupMessageSerializer(chat_messages, many=True, context={'request': request})

        # Return group info and messages
        serializer_group = ChatGroupSerializer(chat_group, context={'request': request})
        return Response({
            "chat_group": serializer_group.data,
            "chat_messages": serializer_chat.data,
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Handle new message creation
        serializer = GroupMessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Save the message and associate it with the group
            message = serializer.save(author=request.user, group=chat_group)
            return Response(GroupMessageSerializer(message, context={'request': request}).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_last_message(request, chat_id):
    chat = get_object_or_404(ChatGroup, id=chat_id)
    last_message = GroupMessage.objects.filter(group=chat).order_by('-created').first()  # Get latest message

    if last_message:
        serializer = GroupMessageSerializer(last_message, context={'request': request})
        return Response(serializer.data, status=200)
    return Response({"message": "No messages found"}, status=404)



@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_chats(request):
    user = request.user
    chat_groups = user.chat_groups.all()

    serialized_chats = ChatGroupSerializer(chat_groups, many=True)

    return Response(serialized_chats.data)


# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def has_unreads(request):

#     user = request.user
    
#     unread_exists = MessageReadStatus.objects.filter(user=user, is_read=False).exists()

#     return Response({"has_unread_messages": unread_exists})


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def has_unreads(request):
    user = request.user

    # Get all unread messages for the user
    unread_messages = MessageReadStatus.objects.filter(user=user, is_read=False).select_related('message')

    # Extract messages from unread statuses
    unread_message_objects = [status.message for status in unread_messages]

    # Serialize unread messages using GroupMessageSerializer
    serializer = GroupMessageSerializer(unread_message_objects, many=True, context={'request': request})

    return Response({"unread_messages": serializer.data})



# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def mark_messages_as_read(request, chat_id):
#     chat = get_object_or_404(ChatGroup, id=chat_id)
#     messages = GroupMessage.objects.filter(group=chat)
#     if messages:
#         for message in messages:
#             MessageReadStatus.objects.update_or_create(
#                 user=request.user, message=message, defaults={'is_read': True}
#             )

#         return JsonResponse({"status": "Messages marked as read for the user"}, status=200)
#     else:
#         return
    

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def mark_messages_as_read(request, chat_id):
    chat = get_object_or_404(ChatGroup, id=chat_id)

    # Update only messages that are unread
    updated_count = MessageReadStatus.objects.filter(
        user=request.user, message__group=chat, is_read=False
    ).update(is_read=True)

    return JsonResponse({"status": f"{updated_count} messages marked as read"}, status=200)
