from djoser.serializers import UserSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username', 'role']
