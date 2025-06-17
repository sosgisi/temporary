# products/admin.py

from django.contrib import admin
from .models import OTP, Product, Cart, CartItem

admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(OTP)