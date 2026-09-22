from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    unit_price = serializers.FloatField(read_only=True)
    subtotal = serializers.FloatField(read_only=True)
    is_wholesale_tier_applied = serializers.BooleanField(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'quantity', 'custom_notes',
            'unit_price', 'subtotal', 'is_wholesale_tier_applied',
            'created_at', 'updated_at'
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.FloatField(read_only=True)
    subtotal = serializers.FloatField(read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'session_key', 'items', 'total_items',
            'subtotal', 'created_at', 'updated_at'
        ]
