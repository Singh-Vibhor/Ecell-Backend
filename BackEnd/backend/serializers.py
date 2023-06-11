from rest_framework import serializers
from .models import Post
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

#I am testing serializer
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')

    def create(self, validated_data: User) -> User:
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            password = make_password(validated_data['password'])
        )
        user.save()
        return user
