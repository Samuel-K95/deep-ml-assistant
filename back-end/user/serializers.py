from rest_framework.serializers import ModelSerializer
from .models import CustomUser
from django.contrib.auth.models import User

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']


class ProfileSerializerForAllFields(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'github_username', 'github_repo', 'access_token']

