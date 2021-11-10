from django.contrib.auth.models import User
from django.core import exceptions
from rest_framework import serializers

from chat.models import Room


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
