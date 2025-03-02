from django.urls import path
from . import views


urlpatterns = [
    path('', views.apiOverview, name='api-overview'),
    path('events-list/', views.eventList, name='events-list'),
    path('my-events/', views.myEvents, name='my-events'),
    path('joined-events/<str:pk>/', views.joinedEvents, name='joined-events'),
    path('events-detail/<str:pk>/', views.eventDetail, name='events-detail'),
    path('events-create/', views.eventCreate, name='events-create'),
    path('events-update/<str:pk>/', views.eventUpdate, name='events-update'),
    path('events-delete/<str:pk>/', views.eventDelete, name='events-delete'),
    path('events-join/<str:pk>/', views.joinEvent, name='events-join'),
    path('events-leave/<str:pk>/', views.leaveEvent, name='events-leave'),
    path('filter_text/', views.filter_by_text, name='filter_text'),
    path('profile/<str:pk>/', views.profile, name='profile'),
    path('follow/<str:pk>/', views.follow, name='follow'),
    path('unfollow/<str:pk>/', views.unfollow, name='unfollow'),
    path('register/', views.register, name='register'),
    path('activate/<str:token>/', views.activate_account, name='activate'),
    path('user_by_id/<str:id>/', views.get_user_by_id, name='user-by-id'), 
    path('user_by_username/<str:username>/', views.get_user_by_username, name='user-by-username'), 
    
]
