import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Заменяем email на phone
    email = None
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Номер телефона должен быть в формате: '+79991234567'. Допускается до 15 цифр."
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        unique=True,
        verbose_name='Номер телефона'
    )
    
    # Дополнительные поля
    is_phone_verified = models.BooleanField(default=False, verbose_name='Телефон подтвержден')
    phone_verification_code = models.CharField(max_length=6, blank=True, null=True)
    phone_verification_sent_at = models.DateTimeField(blank=True, null=True)
    
    # Профиль пользователя
    full_name = models.CharField(max_length=255, blank=True, verbose_name='Полное имя')
    
    # Статистика
    last_activity = models.DateTimeField(default=timezone.now, verbose_name='Последняя активность')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлен')
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['is_phone_verified']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.phone} ({self.username})"

class UserSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sessions')
    device_id = models.CharField(max_length=255, verbose_name='ID устройства')
    device_info = models.JSONField(default=dict, blank=True, verbose_name='Информация об устройстве')
    fcm_token = models.CharField(max_length=255, blank=True, verbose_name='FCM токен')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    last_used = models.DateTimeField(auto_now=True, verbose_name='Последнее использование')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    
    class Meta:
        verbose_name = 'Сессия пользователя'
        verbose_name_plural = 'Сессии пользователей'
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['last_used']),
        ]
    
    def __str__(self):
        return f"{self.user.phone} - {self.device_id}"

class SMSVerification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=17, verbose_name='Номер телефона')
    code = models.CharField(max_length=6, verbose_name='Код подтверждения')
    session_id = models.CharField(max_length=100, verbose_name='ID сессии')
    is_used = models.BooleanField(default=False, verbose_name='Использован')
    expires_at = models.DateTimeField(verbose_name='Истекает в')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    
    class Meta:
        verbose_name = 'SMS верификация'
        verbose_name_plural = 'SMS верификации'
        indexes = [
            models.Index(fields=['phone', 'is_used']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.phone} - {self.code}"