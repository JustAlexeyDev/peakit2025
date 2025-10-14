from rest_framework import viewsets, status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
import random
import string
from django.conf import settings

from .models import CustomUser, SMSVerification, UserSession
from .serializers import (
    PhoneSerializer, SMSCodeSerializer, UserSerializer, 
    UserProfileSerializer, AuthTokenSerializer
)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def send_sms(self, request):
        serializer = PhoneSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        phone = serializer.validated_data['phone']
        
        # Генерируем код (для демо - фиксированный)
        code = "123456"  # В демо режиме всегда 123456
        
        # Создаем или обновляем запись верификации
        verification, created = SMSVerification.objects.update_or_create(
            phone=phone,
            defaults={
                'code': code,
                'session_id': 'demo-session',
                'is_used': False,
                'expires_at': timezone.now() + timedelta(minutes=10)
            }
        )
        
        return Response({
            'success': True,
            'message': 'Код отправлен',
            'code': code  # В демо режиме возвращаем код
        })
    
    @action(detail=False, methods=['post'])
    def verify_sms(self, request):
        serializer = SMSCodeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        phone = serializer.validated_data['phone']
        code = serializer.validated_data['code']
        device_id = serializer.validated_data['device_id']
        device_info = serializer.validated_data.get('device_info', {})
        
        # В демо режиме принимаем любой код, начинающийся с '123'
        if not code.startswith('123'):
            return Response({
                'error': 'Неверный код. В демо режиме используйте код начинающийся с 123'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Создаем или получаем пользователя
        user, created = CustomUser.objects.get_or_create(
            phone=phone,
            defaults={
                'username': f'user_{phone}',
                'is_phone_verified': True
            }
        )
        
        if created:
            user.set_unusable_password()
            user.save()
        else:
            user.is_phone_verified = True
            user.save()
        
        # Создаем или обновляем сессию
        session, _ = UserSession.objects.update_or_create(
            user=user,
            device_id=device_id,
            defaults={
                'device_info': device_info,
                'is_active': True,
                'last_used': timezone.now()
            }
        )
        
        # Создаем или получаем токен
        token, _ = Token.objects.get_or_create(user=user)
        
        # Обновляем последнюю активность
        user.last_activity = timezone.now()
        user.save()
        
        response_data = AuthTokenSerializer({
            'token': token.key,
            'user': user,
            'session_id': session.id
        }).data
        
        return Response(response_data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        # Удаляем токен
        try:
            request.user.auth_token.delete()
        except:
            pass
        
        # Деактивируем сессии для этого устройства
        device_id = request.data.get('device_id')
        if device_id:
            UserSession.objects.filter(
                user=request.user,
                device_id=device_id
            ).update(is_active=False)
        
        return Response({'success': True})

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)
    
    def get_object(self):
        return self.request.user
    
    @action(detail=False, methods=['get', 'put'])
    def profile(self, request):
        if request.method == 'GET':
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)