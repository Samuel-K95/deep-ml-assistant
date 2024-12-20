from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.views import APIView

from .serializers import ProfileSerializer, ProfileSerializerForAllFields
from .models import CustomUser
from .github import Github

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny


import dotenv

dotenv.load_dotenv()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class userRegisterAPIView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializerForAllFields
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        github = Github(user_name= request.data['github_username'], access_token=request.data['access_token'])
        
        user = self.get_queryset().get(email = request.data['email'])
        refresh = RefreshToken.for_user(user)
        repos = github.list_repos()

        response_data = response.data
        response_data['refresh'] = str(refresh)
        response_data['access'] = str(refresh.access_token)
        response_data['repos'] = str(repos)

        return Response(response_data, status=status.HTTP_201_CREATED)
    

class userUpdateAPIView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializerForAllFields
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

class getUserAPIView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

class LoginAPiView(generics.GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data = request.data)
            serializer.is_valid(raise_exception=True)

            user = serializer.validated_data['user']
            github = Github(user_name=user.github_username, access_token=user.access_token)
            repos = github.list_repos()
            refresh = RefreshToken.for_user(user)

            return Response ({'refresh': str(refresh), 'access': str(refresh.access_token), 'username': user.username, 'repos': repos}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'invalid login'}, status=status.HTTP_401_UNAUTHORIZED)



class GithubLogin(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        code = request.session.get('auth_code')

        return Response({'sucess': 'sucess', 'code': code})







        
