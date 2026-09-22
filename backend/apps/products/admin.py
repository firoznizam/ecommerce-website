from django.contrib import admin
from .models import Product, MandiDailyPrice


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'name', 'category', 'price', 'discount_price',
        'stock_quantity', 'is_active', 'created_at', 'updated_at'
    )
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('price', 'discount_price', 'stock_quantity', 'is_active')
    ordering = ('id',)


@admin.register(MandiDailyPrice)
class MandiDailyPriceAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'product', 'auction_date', 'mandi_hub',
        'morning_retail_rate', 'morning_wholesale_rate', 'volume_trend'
    )
    list_filter = ('auction_date', 'mandi_hub')
    search_fields = ('product__name', 'mandi_hub')
