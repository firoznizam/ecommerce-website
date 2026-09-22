from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, MandiDailyPriceViewSet

router = DefaultRouter()
router.register(r'rates', MandiDailyPriceViewSet, basename='mandi-rates')
router.register(r'', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
