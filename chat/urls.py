from django.urls import path

from chat.views import AddRoomView

urlpatterns = [path("add_room/", AddRoomView.as_view())]
