from django.db import models
from django.contrib.auth.models import User


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Room(BaseModel):
    # title is used for group chats
    # for Personal Chat ther is no title
    title = models.CharField(max_length=120, null=True, blank=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="room_owner"
    )
    users = models.ManyToManyField(User, related_name="room_users")

    def __str__(self):
        return f"{self.id} - {self.title}"


class Message(BaseModel):
    content = models.TextField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.author} - {self.created_at}"


class ReadReceipt(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    last_message = models.ForeignKey(Message, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)
