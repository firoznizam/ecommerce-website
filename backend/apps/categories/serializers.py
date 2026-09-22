from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'description',
            'image',
            'created_at',
            'updated_at',
            'slug',
            'products_count',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'products_count']
