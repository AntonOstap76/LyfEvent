from django.shortcuts import  HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import EventSerializer, ProfileSerializer, UserSerializer
from .models import Event, Profile, ActivationToken
from django.contrib.auth.models import User
from rest_framework import status

import base64
from django.core.files.base import ContentFile

from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import Q

from django.shortcuts import get_object_or_404

from django.core.mail import send_mail

import uuid

from django.conf import settings

from django.urls import reverse



@api_view(['GET'])
def apiOverview(request):


    api_urls = [
        {
            'Endpoint': '/events-list/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of events'
        },
        {
            'Endpoint': '/my-events/',
            'method': 'GET',
            'body': None,
            'description': "Returns an array of host's events"
        },
        {
            'Endpoint': '/events-detail/<str:pk>',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single event object'
        },
        {
            'Endpoint': '/events-create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new event with data sent in post request'
        },
        {
            'Endpoint': '/events-update/<str:pk>/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Creates an existing event with data sent in post request'
        },
        {
            'Endpoint': '/events-delete/<str:pk>/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes an exiting event'
        },
        
        {
            'Endpoint': '/token/',
            'method': 'POST',
            'body': {'body': ""},
            'description': "Access token"
        },

        {
            'Endpoint': '/token-refresh/',
            'method': 'POST',
            'body': {'body': ""},
            'description': "Access token"
        },
    ]
    
    return Response(api_urls)

@api_view(['GET'])
def eventList(request):
    events = Event.objects.all().order_by('-created')
    serializer = EventSerializer(events, many=True )
    return Response(serializer.data)


@api_view(['GET'])
def eventDetail(request, pk):
    events = Event.objects.get(id=pk)
    serializer = EventSerializer(events, many=False )
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def eventCreate(request):
    serializer = EventSerializer(data=request.data)
    

    if Event.objects.filter(host=request.user).count() >= 4:
        return Response(
            {"detail": "You can only create up to 4 events."}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    #decoding image from url to file
    if 'image' in request.data:
    # Get the base64 image string
        format, imgstr = request.data['image'].split(';base64,') 
        ext = format.split('/')[-1]  # Extract the image extension (e.g., 'png', 'jpeg')

        # Decode the base64 image string and create a ContentFile to attach to the serializer
        image_data = base64.b64decode(imgstr)
        image_name = f"{request.data['title']}_image.{ext}"  # Naming the image dynamically based on event title
        request.data['image'] = ContentFile(image_data, name=image_name) 
    
    if serializer.is_valid():
        event = serializer.save(host=request.user)
        event.participants.add(request.user)

        return Response({
            "status": "success",
            "message": "Event created successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        "status": "error",
        "message": "Invalid data",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['PUT'])
def eventUpdate(request, pk):
    print(request.data)
    try:
        event = Event.objects.get(id=pk)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

    # Check if the image in the request data is a new one or not
    if 'image' in request.data:
        # If the image is a new file (base64 encoded), process it
        if "data:image" in request.data['image']:
            # Get the base64 image string
            format, imgstr = request.data['image'].split(';base64,') 
            ext = format.split('/')[-1]  # Extract the image extension (e.g., 'png', 'jpeg')

            # Decode the base64 image string and create a ContentFile to attach to the serializer
            image_data = base64.b64decode(imgstr)
            image_name = f"{request.data['title']}_image.{ext}"  # Naming the image dynamically based on event title
            request.data['image'] = ContentFile(image_data, name=image_name)
        else:
            # If it's a URL (i.e., the image is not being changed), leave the image as it is
            # This assumes the image URL is already set on the event model
            request.data['image'] = event.image

    if 'for_students' in request.data and request.data['for_students'] == '':
        request.data['for_students'] = False
        

    # Now we proceed with the regular update logic
    serializer = EventSerializer(instance=event, data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response({
        "status": "error",
        "message": "Invalid data",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def eventDelete(request, pk):
    event = Event.objects.get(id=pk)
    event.delete()

    return Response("SUCCESFULLY DELETED")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myEvents(request):
    my_events = Event.objects.filter(host=request.user).order_by('-updated') 
    serializer = EventSerializer(my_events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def joinedEvents(request, pk):
    user = get_object_or_404(User, id=pk)
    joined_events = user.joined_event.all().order_by('-updated') 
    serializer = EventSerializer(joined_events, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def joinEvent(request, pk):

    user = request.user

    event = Event.objects.get(id=pk)

    event.participants.add(user)
    event.save()

    serializer = EventSerializer(event)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leaveEvent(request, pk):

    user = request.user

    event = Event.objects.get(id=pk)

    event.participants.remove(user)
    event.save()

    serializer = EventSerializer(event)
    return Response(serializer.data)

#Only PostgreSQL
# @api_view(['POST', 'GET'])
# def filter_by_text(request):
#     print(request)
#     text = request.data.get("text", "").strip() 

#     if text:
#         vector = SearchVector('title', 'description', 'category', 'location')
#         query = SearchQuery(text)

#         results = Event.objects.annotate(
#             rank=SearchRank(vector, query)
#         ).filter(rank__gt=0).order_by('-rank')
#     else:
#         results = Event.objects.all()

#     serialized_events = EventSerializer(results, many=True)
#     return Response(serialized_events.data)

@api_view(['POST', 'GET'])
def filter_by_text(request):
    text = request.data.get("text", "").strip()  

    if text:
        results = Event.objects.filter(
            Q(title__icontains=text) |
            Q(description__icontains=text) |
            Q(category__icontains=text) |
            Q(location__icontains=text)
        )
    else:
        results = Event.objects.all()

    serialized_events = EventSerializer(results, many=True)
    return Response(serialized_events.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request, pk):
    profile = get_object_or_404(Profile, user__id=pk)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request, pk):
    user = request.user
    user_to_follow = get_object_or_404(User, id=pk)
    user_to_follow_profile = get_object_or_404(Profile, user=user_to_follow)

    if user == user_to_follow:
        return Response({"error": "You cannot follow yourself."}, status=400)

    profile = get_object_or_404(Profile, user=user)
    

    # Ensure that `following` is a ManyToManyField(User) in Profile
    if user_to_follow in profile.following.all():
        return Response({"message": "You are already following this user."}, status=400)

    profile.following.add(user_to_follow_profile)
    profile.save()

    serializer = ProfileSerializer(profile)
    return Response(serializer.data,  status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow(request, pk):
    user = request.user
    user_to_unfollow = get_object_or_404(User, id=pk)
    print(user_to_unfollow)
    user_to_unfollow_profile = get_object_or_404(Profile, user=user_to_unfollow)


    if user == user_to_unfollow:
        return Response({"error": "You cannot unfollow yourself."}, status=400)
    
    profile = get_object_or_404(Profile, user=user)
    print(list(profile.following.all()))

    if user_to_unfollow_profile not in profile.following.all():
        return Response({"message": "You are not following this user."}, status=400)

    profile.following.remove(user_to_unfollow_profile)
    profile.save()

    serializer = ProfileSerializer(profile)
    return Response(serializer.data, status=200)

from freakyappy.settings import FRONTEND

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password1')

    # Check if the username or email already exists
    if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
        return Response({"error": "Username or email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # Create user but keep it inactive
    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_active = False  
    user.save()

    # If the email contains '@student.', set the student status
    if '@student.' in email:
        profile = get_object_or_404(Profile, user=user)
        profile.student = True  
        profile.save()

    # Generate activation token and send email
    activation_token = str(uuid.uuid4())  
    ActivationToken.objects.create(user=user, token=activation_token)

    frontend_url = f"{FRONTEND}/activate"
    activation_link = f"{frontend_url}?token={activation_token}"

    email_subject = "LyfeVents Email Confirmation"
    email_body = f"Click the link to activate your account: {activation_link}"

    send_mail(
        email_subject,
        email_body,
        'noreply@lyfevents.com',  # Replace with your actual email
        [email],
        fail_silently=False,
    )

    return Response({"message": "Registration successful. Please check your email to activate your account."}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def activate_account(request, token):
    try:
        user_token = ActivationToken.objects.get(token=token) 
        
        user = user_token.user
        
        user.is_active = True
        user.save()
        
        user_token.delete()
        
        return Response(status=200)
    
    except ActivationToken.DoesNotExist:
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def get_user_by_id(request, pk):
    print(pk)
    user = get_object_or_404(User, id=pk)
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_by_username(request, username):
    user = get_object_or_404(User, username=username)
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)



@api_view(['PUT'])
def profile_update(request, pk):
    profile = get_object_or_404(Profile, user__id=pk)

    # Process avatar only if it exists and is not None
    print(request.data)
    avatar = request.data.get('avatar', None)
    if avatar:
        if "data:image" in avatar:
            try:
                format, imgstr = avatar.split(';base64,') 
                ext = format.split('/')[-1]  # Extract image extension
                image_data = base64.b64decode(imgstr)
                image_name = f"{request.user}_image.{ext}"
                request.data['avatar'] = ContentFile(image_data, name=image_name)
            except Exception as e:
                return Response({
                    "status": "error",
                    "message": "Invalid image format",
                    "error": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If the avatar is a URL, retain the existing avatar
            request.data['avatar'] = profile.avatar

    serializer = ProfileSerializer(instance=profile, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response({
        "status": "error",
        "message": "Invalid data",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def reset_pass_link(request):
    email = request.query_params.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=400)

    user = get_object_or_404(User, email=email)

    if user and user.is_active:
        if ActivationToken.objects.filter(user=user).exists():
            return Response({"message": "Password reset link already sent"}, status=200)

        reset_token = str(uuid.uuid4())
        ActivationToken.objects.create(user=user, token=reset_token)

        frontend_url = settings.FRONTEND
        reset_link = f"{frontend_url}/password-update?token={reset_token}"

        email_subject = "LyfeVents Password Reset"
        email_body = f"Click the link to reset your password: {reset_link}"

        send_mail(
            email_subject,
            email_body,
            'noreply@lyfevents.com',
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent"}, status=200)

    return Response({"error": "User not found or inactive"}, status=403)




from django.contrib.auth.hashers import make_password
@api_view(['POST'])
def update_pass(request):
    password = request.data.get("password")
    token = request.data.get("token")

    if not password or not token:
        return Response({"error": "Password and token are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_token = ActivationToken.objects.get(token=token)
        user = user_token.user

        if not user.is_active:
            return Response({"error": "User is not found"}, status=status.HTTP_403_FORBIDDEN)


        user.password = make_password(password)
        user.save()

        user_token.delete()

        return Response({"message": "Password successfully updated"}, status=status.HTTP_200_OK)

    except ActivationToken.DoesNotExist:
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ContactMessage

class ContactMessageView(APIView):
    def post(self, request):
        data = request.data
        ContactMessage.objects.create(
            name=data.get("name"),
            email=data.get("email"),
            message=data.get("message")
        )
        return Response({"message": "Message sent successfully"}, status=status.HTTP_201_CREATED)


from django.http import JsonResponse
import random


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_random_event(request):
    user = request.user  # Get the current user
    print(user)
    session_key = f"last_random_event_{user.id}"  # Create a unique key per user in the session

    # Check if the user is a student through the Profile model
    is_student = user.profile.student  # Accessing the student field in the related Profile model

    # Filter out events created by the user or that the user has joined
    events = Event.objects.exclude(host=user).exclude(participants=user)

    # If the user is not a student, exclude events that are only for students
    if not is_student:
        events = events.exclude(for_students=True)

    # Retrieve the last picked event from the session
    last_event_id = request.session.get(session_key)

    # If a last event exists, exclude it from the selection
    if last_event_id:
        events = events.exclude(id=last_event_id)

    if not events.exists():
        return JsonResponse({"error": "No events available"}, status=404)

    # Convert to a list to use random.choice
    event_list = list(events)

    # Pick a random event
    random_event = random.choice(event_list)

    # Save the picked event ID in the session for the next request
    request.session[session_key] = random_event.id

    return JsonResponse({"id": random_event.id, "name": random_event.title})
