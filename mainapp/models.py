# products/models.py

from django.db import models
from django.contrib.auth.models import User
import random
from datetime import datetime, timedelta

class Category(models.Model):
    name = models.CharField(max_length=100)
# Model Produk
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.name

# Item dalam Keranjang
class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

    def get_total_price(self):
        return self.product.price * self.quantity

# Keranjang pengguna
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart of {self.user.username}"

    def get_total_items(self):
        return sum(item.quantity for item in self.items.all())

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())
    



# OTP 

class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        self.expires_at = datetime.now() + timedelta(minutes=5) # OTP expires in 5 minutes
        super().save(*args, **kwargs)

    def generate_otp(self):
        return str(random.randint(100000, 999999))

    def __str__(self):
        return f"OTP for {self.user.username}"