from rest_framework import viewsets, permissions, filters
from django.shortcuts import get_object_or_404
from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoints:
    GET  /api/categories/      - List all categories (with pagination)
    GET  /api/categories/{id}/ - Retrieve category details by ID or slug
    """
    queryset = Category.objects.filter(is_active=True).order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['id', 'name', 'created_at']

    def get_object(self):
        lookup_val = self.kwargs.get(self.lookup_field, '')
        if str(lookup_val).isdigit():
            return get_object_or_404(Category, id=int(lookup_val))
        return get_object_or_404(Category, slug=lookup_val)
