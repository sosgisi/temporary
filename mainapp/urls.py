# products/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='home'),
    path('checkout/', views.checkout, name='checkout'),
    path('order_success/', views.order, name='order'),
    path('cart/', views.cart, name='cart'),
    path('profile/', views.profile, name='profile'),
    path('order_history/', views.order_history, name='history'),
    path('privacy_policy/', views.privacy_policy, name='privacy'),
    path('help_faq/', views.help_faq, name='help'),
    path('tutorial/', views.tutorial, name='tutorial'),
    path('return_req/', views.return_req, name='return'),
    
    path('api/users/', views.get_all_users, name='get_all_users'),
    path('api/get_current_user/', views.get_current_user, name='get_current_user'),
    path('api/products/', views.get_products, name='get_products'),
    # New Authentication URLs
    path('api/register/', views.register_user, name='register'),
    path('api/login/', views.login_user, name='login'),
    path('api/send_otp/', views.send_otp, name='send_otp'),
    path('api/verify_otp/', views.verify_otp, name='verify_otp'),
    path('api/logout/', views.logout_user, name='logout_user'),
    path('api/cart/add/', views.add_to_cart, name='add_to_cart'),
    path('api/cart/', views.get_cart_items, name='get_cart'),
    path('api/cart/remove/<int:product_id>/', views.remove_cart_item, name='remove_cart_item'),
]