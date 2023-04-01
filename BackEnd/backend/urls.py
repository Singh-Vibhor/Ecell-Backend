from django.urls import path, include
from rest_framework import routers
from django.contrib.auth.models import User
from . import views

router = routers.DefaultRouter()
router.register(r'posts', views.PostView, 'post')
router.register(r'users', views.UserView, 'user')



urlpatterns = [
    path('api/', include(router.urls)),
    path('posts/<str:pk>/', views.Posts.showPost),
    path('posts/', views.Posts.searchPosts),
    path('deletePost/<str:pk>', views.Posts.deletePost),
    path('updatePost/', views.Posts.updatePost),
    path('login/', views.Users.login),
    path('signup/', views.Users.signUp),
    path('createPost/', views.Posts.createPost),

]

