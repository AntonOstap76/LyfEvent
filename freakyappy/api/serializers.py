from rest_framework import serializers
from django.contrib.auth.models import User 
from .models import Event, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username'] 

class EventSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, required=False)
    host = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'host', 'title', 'description', "updated", "capacity", 
                  "category", "image", "participants", 'date', 'location']
        read_only_fields = ['updated', 'created', 'host']

    def get_host(self, obj):
        return {
            "id": obj.host.id,
            "username": obj.host.username
        }

class ProfileSerializer(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'avatar', 'fact1', 'fact2', 'fact3', 'followers', 'following', 'user']
        read_only_fields = ['user']

    def get_following(self, obj):
        return [profile.user.id for profile in obj.following.all()]

    def get_followers(self, obj):
        return [profile.user.id for profile in obj.followers.all()]
    
