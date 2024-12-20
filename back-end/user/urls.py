from django.urls.conf import path, include
from .views import LoginAPiView, userRegisterAPIView, GithubLogin


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('auth/login/', LoginAPiView.as_view(), name='login api view'),
    path('auth/signUp/', userRegisterAPIView.as_view(), name='signup api view'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/github/', GithubLogin.as_view(), name='success'),
]