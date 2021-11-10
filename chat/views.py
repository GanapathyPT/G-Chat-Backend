from rest_framework import permissions, generics

from chat.models import Room
from chat.serializers import CreateRoomSerializer


class AddRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CreateRoomSerializer
