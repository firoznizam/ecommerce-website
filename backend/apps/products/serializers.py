from rest_framework import serializers
from .models import Product, MandiDailyPrice
from apps.categories.serializers import CategorySerializer


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'discount_price',
            'image',
            'category',
            'category_name',
            'category_details',
            'stock_quantity',
            'is_active',
            'created_at',
            'updated_at',
            'unit',
            'malayalam_name',
            'origin',
            'is_featured',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'category_name', 'category_details']


class MandiDailyPriceSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = MandiDailyPrice
        fields = [
            'id', 'product', 'product_name', 'product_unit',
            'mandi_hub', 'auction_date', 'morning_retail_rate',
            'morning_wholesale_rate', 'volume_trend', 'recorded_at'
        ]
