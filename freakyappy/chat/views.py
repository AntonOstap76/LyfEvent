from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import ChatGroupSerializer, GroupMessageSerializer
from rest_framework import status
from .models import ChatGroup, GroupMessage
from api.models import Event

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
        chat_messages = chat_group.chat_messages.all().order_by('created')[:30]
        serializer_chat = GroupMessageSerializer(chat_messages, many=True)

        # Return group info and messages
        serializer_group = ChatGroupSerializer(chat_group)
        return Response({
            "chat_group": serializer_group.data,
            "chat_messages": serializer_chat.data,
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Handle new message creation
        serializer = GroupMessageSerializer(data=request.data)
        if serializer.is_valid():
            # Save the message and associate it with the group
            message = serializer.save(author=request.user, group=chat_group)
            return Response(GroupMessageSerializer(message).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_all_chats(request):
    user = request.user
    chat_groups = user.chat_groups.all()

    serialized_chats = ChatGroupSerializer(chat_groups, many=True)

    return Response(serialized_chats.data)

