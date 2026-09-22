"""
Core URL Configuration for Adam Vegetables Kerala API.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    Entry point for the E-Commerce REST API.
    """
    return Response({
        'status': 'online',
        'service': 'Adam Vegetables Kerala E-Commerce API',
        'version': '1.0.0',
        'endpoints': {
            'categories': '/api/categories/',
            'products': '/api/products/',
            'cart': '/api/v1/cart/',
            'orders': '/api/v1/orders/',
            'users': '/api/v1/users/',
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint for monitoring and container checks.
    """
    return Response({'status': 'healthy'})


urlpatterns = [
    path('admin/', admin.site.urls),

    # Health & API Discovery
    path('api/health/', health_check, name='health_check'),
    path('api/', api_root, name='api_root_base'),
    path('api/v1/', api_root, name='api_root'),

    # Primary E-Commerce Endpoints (as requested)
    path('api/categories/', include('apps.categories.urls')),
    path('api/products/', include('apps.products.urls')),

    # Domain Applications
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/cart/', include('apps.cart.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
]
