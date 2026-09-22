from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for creating, listing, and tracking orders.
    """
    queryset = Order.objects.all().prefetch_related('items')
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and not user.is_staff:
            return Order.objects.filter(user=user).prefetch_related('items')
        return Order.objects.all().prefetch_related('items')

    @action(detail=False, methods=['get'])
    def track(self, request):
        """
        Public order tracking endpoint by order number (e.g. ?order_no=ORD-ABCD1234).
        """
        order_no = request.query_params.get('order_no', '').strip()
        if not order_no:
            return Response({'error': 'order_no query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order.objects.prefetch_related('items'), order_no__iexact=order_no)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
