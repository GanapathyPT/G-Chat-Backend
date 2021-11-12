from django.contrib import admin

from .models import Room, Message, ReadReceipt


class RoomAdmin(admin.ModelAdmin):
    list_display = ("__str__", "created_by")


class MessageAdmin(admin.ModelAdmin):
    list_display = ("__str__", "created_at")


class ReadReceiptAdmin(admin.ModelAdmin):
    list_display = ("__str__", "last_read_message", "room")


admin.site.register(Room, RoomAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(ReadReceipt, ReadReceiptAdmin)
