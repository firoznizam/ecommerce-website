from django.db import models
from django.conf import settings
from apps.products.models import Product


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='carts'
    )
    session_key = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())

    def __str__(self):
        return f"Cart #{self.id} ({self.user.username if self.user else 'Guest: ' + str(self.session_key)})"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=8, decimal_places=2, default=1.0)
    custom_notes = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('cart', 'product')

    @property
    def unit_price(self):
        # Apply wholesale price dynamically if quantity meets product min wholesale threshold
        if self.quantity >= self.product.min_wholesale_qty:
            return self.product.wholesalePrice if hasattr(self.product, 'wholesalePrice') else self.product.wholesale_price
        return self.product.retailPrice if hasattr(self.product, 'retailPrice') else self.product.retail_price

    @property
    def is_wholesale_tier_applied(self):
        return self.quantity >= self.product.min_wholesale_qty

    @property
    def subtotal(self):
        return float(self.unit_price) * float(self.quantity)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
