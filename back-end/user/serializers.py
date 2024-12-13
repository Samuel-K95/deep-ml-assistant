from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

class ProfileSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid Login Credential')
        data['user'] = user
        return data

class ProfileSerializerForAllFields(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'github_username', 'github_repo', 'access_token']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email'].split('@')[0]
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

