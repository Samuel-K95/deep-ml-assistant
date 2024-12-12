from django.db import models
from django.contrib.auth.models import User, AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    github_username = models.CharField(max_length=255)
    github_repo = models.CharField(max_length=255)
    access_token = models.TextField(blank=True, null=True)
    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

