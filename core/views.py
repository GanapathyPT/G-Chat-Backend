from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from core.serializers import (
    TokenObtainPairSerializer_EmailBackend,
    UserDetailSerializer,
    UserRegisterSerializer,
)
from rest_framework import generics, permissions, views


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer


class UserDetailView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserDetailSerializer

    def get(self, request):
        user_serialized_data = UserDetailSerializer(instance=request.user)
        return Response(user_serialized_data.data)


class TokenObtainPairView_EmailBackend(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer_EmailBackend
