from django.urls.conf import path
from .views import getUserView, LoginAPiVIew, userRegisterAPIView

urlpatterns = [
    path('', getUserView.as_view()),
    path('auth/login/', LoginAPiVIew.as_view()),
    path('auth/signUp/', userRegisterAPIView.as_view())
]