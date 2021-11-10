from django.contrib import admin

from .models import Room, Message, ReadStatus


class RoomAdmin(admin.ModelAdmin):
    list_display = ("__str__", "created_by")


class MessageAdmin(admin.ModelAdmin):
    list_display = ("__str__", "created_at")


class ReadStatusAdmin(admin.ModelAdmin):
    list_display = ("__str__", "last_message", "room")


admin.site.register(Room, RoomAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(ReadStatus, ReadStatusAdmin)
