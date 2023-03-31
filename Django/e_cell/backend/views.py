from django.shortcuts import render
from rest_framework import viewsets
from .serializers import PostSerializer, UserSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Post
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from django.contrib.auth.hashers import check_password
import rest_framework
import json


# Create your views here.

class PostView(viewsets.ModelViewSet):
    
    serializer_class = PostSerializer
    queryset = Post.objects.all()


class UserView(viewsets.ModelViewSet):
    
    serializer_class = UserSerializer
    queryset = User.objects.all()

class Posts:

    @api_view(('GET',))
    def showPost(request: rest_framework.request.Request, pk: str) -> rest_framework.response.Response:

        queryset = Post.objects.get(id = pk)
        queryset = PostSerializer(queryset, many = False)
        return Response(queryset.data)
    
    
    @api_view(['GET'])
    def searchPosts(request: rest_framework.request.Request) -> rest_framework.response.Response:
        
        q = request.GET.get('q') if request.GET.get('q') != None else ""
        print(q)
        queryset = Post.objects.filter(
            Q(name__icontains = q) |
            Q(description__icontains = q) |
            Q(User__username__icontains = q)
            )
        queryset = PostSerializer(queryset, many = True)
        return Response(queryset.data)
    

    @api_view(['POST'])
    def deletePost(request: rest_framework.request.Request, pk) -> HttpResponse:
        post = Post.objects.get(id = pk)
        try:
            post.delete()
            return HttpResponse(0)
        except:
            return HttpResponse(-1)
        

    @api_view(['POST'])
    def updatePost(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        pk = data['id']
        post = Post.objects.get(id = pk)
        post.name = data['name']
        post.description = data['description']
        try:
            post.save()
            return HttpResponse(0)
        except:
            return HttpResponse(-1)
        
    
    @api_view(['POST'])
    def createPost(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        data = PostSerializer(data = data)
        if data.is_valid():
            try:
                data.save()
                return HttpResponse(0)
            except:
                return HttpResponse(-1)
        return HttpResponse(-1)

        

class Users:

    @api_view(['GET', 'POST'])
    def signUp(request: rest_framework.request.Request) -> HttpResponse:
        dt = json.loads(request.body.decode("utf-8"))
        data = UserSerializer(data = dt)
        if data.is_valid():
            try:
                data.save()
                return HttpResponse(0)
            except:
                return HttpResponse(-1)
        return HttpResponse(-1)

    
    @api_view(['POST'])
    def login(request: rest_framework.request.Request) -> HttpResponse:
        data = json.loads(request.body.decode("utf-8"))
        for x in User.objects.all():
            if x.username==data['username'] and check_password(data['password'], x.password):
                rt = {'response' : 0, 'id' : x.id, 'username': x.username}
                return HttpResponse(json.dumps(rt))
        return HttpResponse(json.dumps({'response':-1}))