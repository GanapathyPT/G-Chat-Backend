from django.contrib.auth.models import User
from core.serializers import UserRegisterSerializer
from rest_framework import generics, permissions


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer
