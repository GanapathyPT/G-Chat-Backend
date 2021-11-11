from django.urls import path

from chat.views import AddRoomView, MessageCreateView, NewMessagesListView, RoomListView

urlpatterns = [
    path("add_room/", AddRoomView.as_view()),
    path("rooms/", RoomListView.as_view()),
    path("new_message/", MessageCreateView.as_view()),
    path("get_new_messages/", NewMessagesListView.as_view()),
]
