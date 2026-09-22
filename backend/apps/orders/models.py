import uuid
from django.db import models
from django.conf import settings
from apps.products.models import Product


def generate_order_number():
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending Confirmation'),
        ('Confirmed', 'Order Confirmed'),
        ('Preparing', 'Harvesting & Packing'),
        ('Ready', 'Ready for Dispatch'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    CUSTOMER_TYPE_CHOICES = (
        ('retail', 'Retail Household'),
        ('wholesale', 'Wholesale Commercial'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('cash_on_delivery', 'Cash on Delivery (COD)'),
        ('upi_direct', 'UPI Direct (GPay / PhonePe / Paytm)'),
        ('bank_transfer', 'Commercial Bank Transfer (B2B)'),
        ('store_pickup', 'Direct Mandi / Store Pickup'),
    )

    order_no = models.CharField(
        max_length=30,
        unique=True,
        default=generate_order_number,
        db_index=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    customer_whatsapp = models.CharField(max_length=20, blank=True, default='')
    customer_email = models.EmailField(blank=True, null=True)
    customer_type = models.CharField(
        max_length=20,
        choices=CUSTOMER_TYPE_CHOICES,
        default='retail'
    )

    delivery_address = models.TextField()
    delivery_zone = models.CharField(max_length=100, blank=True, default='Kochi Central')
    delivery_slot = models.CharField(max_length=100, default='Morning (06:00 AM - 09:00 AM)')
    preferred_delivery_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        default='cash_on_delivery'
    )
    is_paid = models.BooleanField(default=False)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    coupon_code = models.CharField(max_length=50, blank=True, default='')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_no} - {self.customer_name} (₹{self.total})"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_items'
    )
    product_name = models.CharField(max_length=150)
    unit = models.CharField(max_length=20, default='kg')
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    is_wholesale_price_applied = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.quantity} {self.unit} x {self.product_name} ({self.order.order_no})"
