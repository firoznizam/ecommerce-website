from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Customer Info', {
            'fields': (
                'phone', 'whatsapp_number', 'customer_type', 'business_name',
                'business_type', 'default_address', 'delivery_zone', 'is_verified'
            )
        }),
    )
    list_display = ('username', 'email', 'phone', 'customer_type', 'is_staff', 'is_active')
    list_filter = ('customer_type', 'is_staff', 'is_active', 'is_verified')
