from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserSession, SMSVerification

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['phone', 'username', 'full_name', 'is_phone_verified', 'is_active', 'created_at']
    list_filter = ['is_phone_verified', 'is_active', 'is_staff', 'created_at']
    search_fields = ['phone', 'username', 'full_name']
    readonly_fields = ['last_activity', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {'fields': ('phone', 'username', 'password')}),
        ('Персональная информация', {'fields': ('full_name', 'first_name', 'last_name', 'avatar')}),
        ('Верификация', {'fields': ('is_phone_verified', 'phone_verification_code', 'phone_verification_sent_at')}),
        ('Разрешения', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'last_activity', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'username', 'password1', 'password2'),
        }),
    )

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'device_id', 'is_active', 'last_used', 'created_at']
    list_filter = ['is_active', 'last_used', 'created_at']
    search_fields = ['user__phone', 'user__username', 'device_id']
    readonly_fields = ['created_at', 'last_used']

@admin.register(SMSVerification)
class SMSVerificationAdmin(admin.ModelAdmin):
    list_display = ['phone', 'code', 'is_used', 'expires_at', 'created_at']
    list_filter = ['is_used', 'expires_at', 'created_at']
    search_fields = ['phone']
    readonly_fields = ['created_at']