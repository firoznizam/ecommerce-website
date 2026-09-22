from rest_framework import viewsets, permissions, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Product, MandiDailyPrice
from .serializers import ProductSerializer, MandiDailyPriceSerializer


class ProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoints:
    GET  /api/products/          - List all products (with pagination, search, category filter)
    GET  /api/products/{id}/     - Retrieve product details by ID or slug
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['id', 'price', 'created_at', 'name', 'stock_quantity']
    ordering = ['id']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')
        
        # Category filtering by ID or by slug
        category_param = self.request.query_params.get('category')
        if category_param:
            if str(category_param).isdigit():
                queryset = queryset.filter(category_id=int(category_param))
            else:
                queryset = queryset.filter(category__slug=category_param)
        
        # Optional min_price / max_price filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def get_object(self):
        lookup_val = self.kwargs.get(self.lookup_field, '')
        if str(lookup_val).isdigit():
            return get_object_or_404(Product.objects.select_related('category'), id=int(lookup_val))
        return get_object_or_404(Product.objects.select_related('category'), slug=lookup_val)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)
        page = self.paginate_queryset(featured_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def todays_prices(self, request):
        """
        Live morning mandi auction rates and daily prices for all active produce.
        """
        products = self.get_queryset()
        data = []
        for p in products:
            data.append({
                'id': p.id,
                'name': p.name,
                'price': float(p.price),
                'discount_price': float(p.discount_price) if p.discount_price else None,
                'unit': p.unit,
                'stock_quantity': p.stock_quantity,
                'category': p.category.name if p.category else None,
                'last_updated': p.updated_at,
            })
        return Response(data)


class MandiDailyPriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MandiDailyPrice.objects.all().select_related('product')
    serializer_class = MandiDailyPriceSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ProductPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['auction_date', 'mandi_hub']
    ordering_fields = ['auction_date', 'morning_retail_rate']
