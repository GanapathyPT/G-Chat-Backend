from django.contrib.auth.models import User
from rest_framework import serializers

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


class RoomSerializer(serializers.ModelSerializer):
    last_message_id = serializers.SerializerMethodField(required=False)
    messages = MessageSerializer(many=True, source="message_set")
    users = UserDetailSerializer(many=True)

    class Meta:
        model = Room
        fields = ("id", "title", "users", "messages", "last_message_id")

    def get_last_message_id(self, room):
        user = self.context.get("request").user
        read_receipt = None
        try:
            read_receipt = ReadReceipt.objects.get(room=room, user=user)
            return read_receipt.last_message.id
        except ReadReceipt.DoesNotExist:
            return -1
