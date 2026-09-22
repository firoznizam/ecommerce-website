from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'unit', 'quantity',
            'unit_price', 'subtotal', 'is_wholesale_price_applied'
        ]


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.FloatField()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_no', 'customer_name', 'customer_phone',
            'customer_whatsapp', 'customer_email', 'customer_type',
            'delivery_address', 'delivery_zone', 'delivery_slot',
            'preferred_delivery_date', 'notes', 'payment_method',
            'is_paid', 'subtotal', 'delivery_fee', 'discount',
            'coupon_code', 'total', 'status', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_no', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_phone', 'customer_whatsapp',
            'customer_email', 'customer_type', 'delivery_address',
            'delivery_zone', 'delivery_slot', 'preferred_delivery_date',
            'notes', 'payment_method', 'delivery_fee', 'discount',
            'coupon_code', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None

        order = Order.objects.create(user=user, **validated_data)

        running_subtotal = 0.0
        for item_data in items_data:
            p = Product.objects.get(id=item_data['product_id'])
            qty = float(item_data['quantity'])
            is_wholesale = qty >= p.min_wholesale_qty
            price = float(p.wholesale_price if is_wholesale else p.retail_price)
            item_subtotal = price * qty
            running_subtotal += item_subtotal

            OrderItem.objects.create(
                order=order,
                product=p,
                product_name=p.name,
                unit=p.unit,
                quantity=qty,
                unit_price=price,
                subtotal=item_subtotal,
                is_wholesale_price_applied=is_wholesale
            )

        order.subtotal = running_subtotal
        delivery_fee = float(order.delivery_fee or 0.0)
        discount = float(order.discount or 0.0)
        order.total = max(0.0, running_subtotal + delivery_fee - discount)
        order.save()

        return order
