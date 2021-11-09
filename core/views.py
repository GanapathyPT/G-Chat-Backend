from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from core.serializers import (
    TokenObtainPairSerializer_EmailBackend,
    UserRegisterSerializer,
)
from rest_framework import generics, permissions


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer


class TokenObtainPairView_EmailBackend(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer_EmailBackend
