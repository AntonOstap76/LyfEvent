from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class EventSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = ['id', 'host', 'title', 'description', "updated", "capacity", 
                  "category", "image", "participants", 'date', 'location', 'for_students']
        read_only_fields = ['updated', 'created', 'host']



    def get_host(self, obj):
        return {
            "id": obj.host.id,
            "name": obj.host.username
        }

    def get_joined_count(self, obj):
        return obj.participants.count()


class ProfileSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    is_complete = serializers.SerializerMethodField()

    def get_is_complete(self, obj):
        return obj.is_complete()
    
    class Meta:
        model = Profile
        fields = ['id', 'avatar', 'fact1', 'fact2', 'fact3', 'followers', 'following', 'user', 'student', "is_complete"]
        read_only_fields = ['user']

    def get_following(self, obj):
        return [profile.user.id for profile in obj.following.all()]

    def get_followers(self, obj):
        return [profile.user.id for profile in obj.followers.all()]

