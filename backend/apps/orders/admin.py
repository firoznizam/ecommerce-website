from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'unit', 'quantity', 'unit_price', 'subtotal', 'is_wholesale_price_applied')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_no', 'customer_name', 'customer_phone', 'customer_type',
        'total', 'payment_method', 'status', 'created_at'
    )
    list_filter = ('status', 'customer_type', 'payment_method', 'created_at')
    search_fields = ('order_no', 'customer_name', 'customer_phone', 'customer_email')
    inlines = [OrderItemInline]
    list_editable = ('status',)
