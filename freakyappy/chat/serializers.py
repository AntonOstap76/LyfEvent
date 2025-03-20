from rest_framework import serializers
from . models import ChatGroup, GroupMessage, MessageReadStatus

class ChatGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = '__all__'


class GroupMessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    is_read_for_you = serializers.SerializerMethodField()  # Updated name to match `fields`

    class Meta:
        model = GroupMessage
        fields = ['id', 'group', 'author', 'author_username', 'text', 'created', 'is_read_for_you']

    def get_is_read_for_you(self, obj):
        # Ensure the user is authenticated before querying
        if self.context['request'].user.is_authenticated:
            user = self.context['request'].user
            return MessageReadStatus.objects.filter(user=user, message=obj, is_read=True).exists()
        else:
            return False 
