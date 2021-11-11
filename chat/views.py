from rest_framework import permissions, generics

from chat.models import Message, Room
from chat.serializers import (
    CreateRoomSerializer,
    CreateMessageSerializer,
    RoomSerializer,
)


class AddRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CreateRoomSerializer


class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = RoomSerializer

    def get_queryset(self):
        user = self.request.user
        rooms = user.room_users.all()
        return rooms


class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CreateMessageSerializer
