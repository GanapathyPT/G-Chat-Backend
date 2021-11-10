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

    def post(self, request, *args, **kwargs):
        super().post(request, *args, **kwargs)
        user = self.request.user
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


class TokenObtainPairView_EmailBackend(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer_EmailBackend
