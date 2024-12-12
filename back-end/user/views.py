from rest_framework import generics
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, AllowAny, IsAuthenticated

from .serializers import ProfileSerializer, ProfileSerializerForAllFields
from .models import CustomUser


class getUserView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]


class userRegisterAPIView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ProfileSerializerForAllFields
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    

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
    

class LoginAPiVIew(generics.GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
        except:
            pass
