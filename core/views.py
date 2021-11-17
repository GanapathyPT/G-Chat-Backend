from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
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

    def create(self, request, *args, **kwargs):
        # create user with UserRegisterSerializer
        response = super().create(request, *args, **kwargs)
        # get the user object
        user_email = response.data.get("email")
        user = User.objects.get(email=user_email)
        # create tokens for the user and return as response
        refresh_token = RefreshToken.for_user(user)
        return Response(
            {"refresh": str(refresh_token), "access": str(refresh_token.access_token)}
        )


class UserDetailView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserDetailSerializer

    def get(self, request):
        user_serialized_data = UserDetailSerializer(instance=request.user)
        return Response(user_serialized_data.data)


class UserSearchView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserDetailSerializer

    def get_queryset(self):
        queryset = []
        username = self.request.query_params.get("username")
        if username is not None:
            queryset = User.objects.filter(username__contains=username)
        return queryset


class TokenObtainPairView_EmailBackend(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer_EmailBackend
