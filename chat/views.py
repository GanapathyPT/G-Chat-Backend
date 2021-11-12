from django.core.exceptions import ValidationError
from rest_framework import exceptions, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.models import Message, ReadReceipt, Room
from chat.serializers import (
    CreateRoomSerializer,
    CreateMessageSerializer,
    MessageSerializer,
    RoomSerializer,
)


class AddRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CreateRoomSerializer

    def perform_create(self, serializer):
        return super().perform_create(serializer)

    def create(self, request, *args, **kwargs):
        user = request.user
        # create room with default serializer
        room = super().create(request, *args, **kwargs)
        # get the room and add our user to it
        room_id = room.data.get("id")
        room = Room.objects.get(pk=room_id)
        room.users.add(user)
        room.save()
        # now return the serialized response same as list room
        room_serialized = RoomSerializer(room, context={"request": request}).data
        return Response(room_serialized)


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


class NewMessagesListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user

        # room must be of the form [{"room_id": int, "last_read_message": int}]
        room_list = request.data.get("room_list")
        if room_list is None:
            raise exceptions.ValidationError("RoomList is required")

        if len(room_list) == 0:
            return Response({})

        if not all(
            map(
                lambda room: room.get("room_id") is not None
                and room.get("last_message") is not None,
                room_list,
            )
        ):
            raise exceptions.ValidationError("Invalid Format")

        response = {}

        for room in room_list:
            room_id = room.get("room_id")
            last_message = room.get("last_message")
            new_messages = (
                Message.objects.prefetch_related("room")
                .prefetch_related("room__users")
                .filter(room=room_id)
                .filter(id__gt=last_message)
                .all()
            )
            # check if current user belongs to the room
            if len(new_messages) > 0 and user not in new_messages[0].room.users.all():
                raise exceptions.MethodNotAllowed("Not your room")

            new_messages = MessageSerializer(new_messages, many=True)
            response[room_id] = new_messages.data

        return Response(response)


class MarkAsReadView(APIView):
    permission_class = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user

        room_id = request.data.get("room_id")
        last_read_message = request.data.get("last_read_message")

        if not all([room_id, last_read_message]):
            raise exceptions.ValidationError("data not provided")

        room = None
        message = None
        try:
            room = Room.objects.get(pk=room_id)
            message = Message.objects.get(pk=last_read_message)
        except (Room.DoesNotExist, Message.DoesNotExist):
            raise exceptions.NotFound("Room or Message not found")

        read_receipt = None
        try:
            read_receipt = ReadReceipt.objects.get(room=room, user=user)
        except ReadReceipt.DoesNotExist:
            raise ValidationError("Read Receipt not found")

        read_receipt.last_read_message = message.id
        read_receipt.save()
        return Response("done")


# TODO: optimise and make code clean for NewMessageListView and MarkAsReadView
