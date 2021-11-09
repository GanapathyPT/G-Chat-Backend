from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import TokenObtainPairView_EmailBackend, UserRegisterView

urlpatterns = [
    path("register/", UserRegisterView.as_view()),
    path("token/", TokenObtainPairView_EmailBackend.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
]
