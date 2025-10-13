from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
import random
import string
from .models import CustomUser, SMSVerification, UserSession

class PhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=17, required=True)

class SMSCodeSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=17, required=True)
    code = serializers.CharField(max_length=6, required=True)
    device_id = serializers.CharField(max_length=255, required=True)
    device_info = serializers.JSONField(default=dict, required=False)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'phone', 'username', 'full_name', 'avatar', 'is_phone_verified', 
                 'last_activity', 'created_at']
        read_only_fields = ['id', 'is_phone_verified', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'phone', 'username', 'full_name', 'avatar', 'first_name', 
                 'last_name', 'is_phone_verified', 'last_activity']
        read_only_fields = ['id', 'phone', 'is_phone_verified']

class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=17, required=True)
    device_id = serializers.CharField(max_length=255, required=True)
    device_info = serializers.JSONField(default=dict, required=False)

class AuthTokenSerializer(serializers.Serializer):
    token = serializers.CharField()
    user = UserSerializer()
    session_id = serializers.UUIDField()