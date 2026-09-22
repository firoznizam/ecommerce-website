from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    CUSTOMER_TYPE_CHOICES = (
        ('retail', 'Retail Household'),
        ('wholesale', 'Wholesale / Commercial'),
    )

    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    customer_type = models.CharField(
        max_length=20,
        choices=CUSTOMER_TYPE_CHOICES,
        default='retail'
    )
    business_name = models.CharField(max_length=150, blank=True, null=True)
    business_type = models.CharField(max_length=50, blank=True, null=True)
    default_address = models.TextField(blank=True, null=True)
    delivery_zone = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_customer_type_display()})"
