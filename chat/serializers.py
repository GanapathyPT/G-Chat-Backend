from django.contrib.auth.models import User
from rest_framework import exceptions, serializers

from chat.models import Message, ReadReceipt, Room
from core.serializers import UserDetailSerializer


class CreateRoomSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False)
    # we will just get list of id (pk) for the user
    users = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    # no need to return so hidden field
    # default value is the current user
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Room
        fields = ("id", "title", "users", "created_by")


class MessageSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
    )

    class Meta:
        model = Message
        fields = ("id", "content", "author")


class CreateMessageSerializer(serializers.ModelSerializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Message
        fields = ("id", "content", "author", "room")

    def create(self, validated_data):
        message = super().create(validated_data)
        read_receipt = None
        try:
            read_receipt = ReadReceipt.objects.get(
                room=message.room, user=message.author
            )
        except ReadReceipt.DoesNotExist:
            raise exceptions.NotFound("No read receipt found")

        read_receipt.last_read_message = message.id
        read_receipt.save()
        return message


class RoomSerializer(serializers.ModelSerializer):
    last_read_message = serializers.SerializerMethodField(required=False)
    messages = MessageSerializer(many=True, source="message_set")
    users = UserDetailSerializer(many=True)

    class Meta:
        model = Room
        fields = ("id", "title", "users", "messages", "last_read_message")

    def get_last_read_message(self, room):
        user = self.context.get("request").user
        read_receipt = None
        try:
            read_receipt = ReadReceipt.objects.get(room=room, user=user)
        except ReadReceipt.DoesNotExist:
            # if not read receipt with room and user then creating one
            # last_read_message is -1 as there won't be any messages
            read_receipt = ReadReceipt()
            read_receipt.user = user
            read_receipt.room = room
            read_receipt.last_read_message = -1
            read_receipt.save()

        return read_receipt.last_read_message
