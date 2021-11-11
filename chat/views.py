from rest_framework import exceptions, permissions, generics, status
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

        # room must be of the form [{"id": int, "last_message_id": int}]
        rooms = request.data.get("rooms")
        if rooms is None:
            raise exceptions.ValidationError("Room is required")

        if len(rooms) == 0:
            return Response({})

        if not all(
            map(
                lambda room: room.get("id") is not None
                and room.get("last_message_id") is not None,
                rooms,
            )
        ):
            raise exceptions.ValidationError("Invalid Format")

        response = {}

        for room in rooms:
            room_id = room.get("id")
            last_message_id = room.get("last_message_id")
            new_messages = (
                Message.objects.prefetch_related("room")
                .prefetch_related("room__users")
                .filter(room=room_id)
                .filter(id__gt=last_message_id)
                .all()
            )
            if len(new_messages) > 0 and user not in new_messages[0].room.users.all():
                raise exceptions.MethodNotAllowed("not your room")

            new_messages = MessageSerializer(new_messages, many=True)
            response[room_id] = new_messages.data

        return Response(response)


class MarkAsReadView(APIView):
    permission_class = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user

        room_id = request.data.get("room")
        last_message_id = request.data.get("last_message_id")

        if not all([room_id, last_message_id]):
            raise exceptions.ValidationError("data not provided")

        read_receipt = None
        try:
            read_receipt = ReadReceipt.objects.get(room=room_id, user=user)
        except ReadReceipt.DoesNotExist:
            # just for now
            raise exceptions.NotFound()

        # DANGER: JUST FOR NOW
        message = Message.objects.get(pk=last_message_id)

        read_receipt.last_message = message
        read_receipt.save()
        return Response("done")
