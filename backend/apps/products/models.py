from django.db import models
from django.utils.text import slugify
from apps.categories.models import Category


class Product(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=500, blank=True, default='')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )
    stock_quantity = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Regional & Produce Attributes
    malayalam_name = models.CharField(max_length=150, blank=True, null=True)
    arabic_name = models.CharField(max_length=150, blank=True, null=True)
    origin = models.CharField(max_length=120, blank=True, default='Kerala Farms')
    unit = models.CharField(max_length=20, default='kg')
    min_wholesale_qty = models.PositiveIntegerField(default=10)
    is_featured = models.BooleanField(default=False)
    is_organic = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def retail_price(self):
        return self.price

    @property
    def wholesale_price(self):
        return self.discount_price if self.discount_price is not None else self.price

    @property
    def stock(self):
        return self.stock_quantity

    def __str__(self):
        return f"{self.name} (₹{self.price})"


class MandiDailyPrice(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='mandi_rates'
    )
    mandi_hub = models.CharField(max_length=100, default='Kerala Central Mandi')
    auction_date = models.DateField()
    morning_retail_rate = models.DecimalField(max_digits=10, decimal_places=2)
    morning_wholesale_rate = models.DecimalField(max_digits=10, decimal_places=2)
    volume_trend = models.CharField(max_length=50, blank=True, default='Normal Supply')
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-auction_date', 'product__name']
        unique_together = ('product', 'auction_date', 'mandi_hub')

    def __str__(self):
        return f"{self.product.name} - {self.auction_date} ({self.mandi_hub})"
