# products/views.py
from django.utils.timezone import localtime
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.http import JsonResponse # To send JSON responses for AJAX
from django.views.decorators.csrf import csrf_exempt # For AJAX, consider CSRF tokens properly in production
from django.core.mail import send_mail
from datetime import datetime, timedelta
from .models import OTP # Import the OTP model
import traceback
import json
from django.utils.timezone import now
from .models import Cart, CartItem, Product, Order, OrderItem
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import CartItem

# Existing views (keep them as they are)
def dashboard(request):
    return render(request, 'dashboard.html')

def cart(request):
    return render(request, 'cart.html')

def checkout(request):
    return render(request, 'checkout.html')

def profile(request):
    return render(request, 'profile.html')

def order(request):
    return render(request, 'order_success.html')

def order_history(request):
    return render(request, 'order_history.html')

def privacy_policy(request):
    return render(request, 'privacy_policy.html')

def help_faq(request):
    return render(request, 'help_faq.html')

def tutorial(request):
    return render(request, 'tutorial.html')

def return_req(request):
    return render(request, 'return_req.html')

@login_required
def get_all_users(request):
    users = User.objects.all().values('id', 'username', 'email', 'first_name', 'last_name')
    return JsonResponse(list(users), safe=False)

#Login, Regis,dan OTP
@csrf_exempt # For development, remove and implement proper CSRF for production AJAX
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)

            print(data)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return JsonResponse({'success': True, 'message': 'Login successful.'}, status=200)
                else:
                    # If user is not active, try to resend OTP
                    send_otp_to_email(user) # Resend OTP if user tries to login but is not active
                    return JsonResponse({'success': False, 'message': 'Account not activated. An OTP has been sent to your email for verification.'}, status=403)
            else:
                return JsonResponse({'success': False, 'message': 'Invalid username or password.'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')
            phone = data.get('phone') 

            if not all([username, email, password]):
                return JsonResponse({'success': False, 'message': 'All fields are required.'}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Username already exists.'}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email already exists.'}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password)
            
            # Kalau kamu pakai custom User model
            user.first_name = name 
            user.phone = phone 
            user.is_active = False
            user.save()

            # send_otp_to_email(user)
    
            return JsonResponse({'success': True, 'message': 'Registration successful. OTP sent to your email for verification.'}, status=201)

        except Exception as e:
            traceback.print_exc()  # ini akan cetak error lengkap ke console
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@csrf_exempt # For development, remove and implement proper CSRF for production AJAX
def send_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email_or_username = data.get('email_or_username')

            if not email_or_username:
                return JsonResponse({'success': False, 'message': 'Email or Username is required.'}, status=400)

            user = User.objects.filter(email=email_or_username).first()
            if not user:
                user = User.objects.filter(username=email_or_username).first()

            if user:
                send_otp_to_email(user)
                return JsonResponse({'success': True, 'message': 'OTP sent to your email.'}, status=200)
            else:
                return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@csrf_exempt # For development, remove and implement proper CSRF for production AJAX
def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email_or_username = data.get('email_or_username')
            otp_code = data.get('otp_code')

            if not all([email_or_username, otp_code]):
                return JsonResponse({'success': False, 'message': 'Email/Username and OTP are required.'}, status=400)

            user = User.objects.filter(email=email_or_username).first() or \
                   User.objects.filter(username=email_or_username).first()

            if not user:
                return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

            try:
                otp_obj = OTP.objects.get(user=user)
                if otp_obj.otp_code == otp_code:
                    if otp_obj.expires_at > now():
                        user.is_active = True
                        user.save()
                        otp_obj.delete()  # Delete used OTP
                        return JsonResponse({'success': True, 'message': 'Akun berhasil diverifikasi. Silakan login.'})
                    else:
                        return JsonResponse({'success': False, 'message': 'OTP sudah kedaluwarsa. Silakan minta ulang.'}, status=400)
                else:
                    return JsonResponse({'success': False, 'message': 'OTP tidak valid.'}, status=400)
            except OTP.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'OTP tidak ditemukan. Silakan minta ulang.'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Permintaan tidak valid (JSON error).'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Metode permintaan tidak diizinkan.'}, status=405)


def send_otp_to_email(user):
    OTP.objects.filter(user=user).delete()

    otp_obj = OTP.objects.create(user=user)
    otp_code = otp_obj.generate_otp()
    otp_obj.otp_code = otp_code
    otp_obj.save()

    subject = 'Your Terusan Minimarket OTP Verification Code'
    message = (
        f'Hi {user.username},\n\nYour OTP verification code is: {otp_code}\n\n'
        'This code will expire in 5 minutes. Do not share this code with anyone.\n\n'
        'Thank you,\nTerusan Minimarket Team'
    )
    from_email = settings.EMAIL_HOST_USER  # ✅ Gunakan email dari settings.py
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)


def get_current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username
        })
    return JsonResponse({'is_authenticated': False})

#Cart, CartItem, Product
@csrf_exempt  # Gunakan jika kamu belum pakai CSRF token
@login_required
def add_to_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)
        product_id = data.get("product_id")
        quantity = data.get("quantity", 1)

        product = Product.objects.get(id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return JsonResponse({"success": True})
    return JsonResponse({"error": "Invalid request"}, status=400)

@login_required
def get_cart_items(request):
    cart = Cart.objects.get(user=request.user)
    items = [{
        'product_id': item.product.id,
        'name': item.product.name,
        'price': item.product.price,
        'quantity': item.quantity
    } for item in cart.items.all()]

    return JsonResponse({'items': items})

@csrf_exempt
@login_required
def remove_cart_item(request, product_id):
    try:
        cart = Cart.objects.get(user=request.user)
        item = CartItem.objects.get(cart=cart, product__id=product_id)
        item.delete()
        return JsonResponse({'success': True, 'message': 'Item removed from cart.'})
    except CartItem.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Item not found in cart.'}, status=404)
    
@csrf_exempt
@login_required
def add_to_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            quantity = int(data.get('quantity', 1))

            product = Product.objects.get(id=product_id)
            cart, _ = Cart.objects.get_or_create(user=request.user)

            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
            cart_item.save()

            return JsonResponse({
                'success': True,
                'message': f'{product.name} berhasil ditambahkan ke keranjang.',
                'total_items': cart.get_total_items()
            })

        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Produk tidak ditemukan.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Hanya metode POST yang diperbolehkan.'}, status=405)

@login_required
def get_cart_count(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return JsonResponse({'success': True, 'total_items': cart.get_total_items()})

@csrf_exempt  # Hanya untuk development! Gunakan CSRF yang benar di production.
def logout_user(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True, 'message': 'Berhasil logout'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

def get_products(request):
    products = Product.objects.all()
    data = []

    for product in products:
        data.append({
            'id': product.id,
            'name': product.name,
            'price': float(product.price),
            'description': product.description,
            'category': product.category.name if product.category else '',
            'image': product.image.url if product.image else '',
            'stock': product.stock,
        })

    return JsonResponse(data, safe=False)

@login_required
def api_cart_items(request):
    cart_items = CartItem.objects.filter(cart__user=request.user)
    items_data = []
    total = 0

    for item in cart_items:
        item_total = item.get_total_price()
        total += item_total
        items_data.append({
            "product_name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "total_price": item_total,
        })

    return JsonResponse({
        "items": items_data,
        "total": total
    })

@csrf_exempt  # atau gunakan @ensure_csrf_cookie di template
@login_required
def api_clear_cart(request):
    if request.method == "POST":
        CartItem.objects.filter(cart__user=request.user).delete()
        return JsonResponse({"success": True})
    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
@login_required
def api_checkout(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            address = data.get("address")
            city = data.get("city")
            postal_code = data.get("postal_code")
            payment_method = data.get("payment_method")
            
            if not all([address, city, postal_code, payment_method]):
                return JsonResponse({"error": "Data tidak lengkap."}, status=400)
            
            cart_items = CartItem.objects.filter(cart__user=request.user)
            if not cart_items.exists():
                return JsonResponse({"error": "Keranjang kosong."}, status=400)

            total = sum([item.get_total_price() for item in cart_items])

            order = Order.objects.create(
                user=request.user,
                address=address,
                city=city,
                postal_code=postal_code,
                payment_method=payment_method,
                total=total,
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )
                cart_items.delete()
            return JsonResponse({"success": True})
        except Exception as e:
            print("Checkout Error:", str(e))
            traceback.print_exc()
        return JsonResponse({"error": "Server error"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

@login_required
def api_order_history(request):
    user = request.user
    try:
        orders = Order.objects.filter(user=user).order_by("-created_at")
        formatted_orders = []

        for order in orders:
            order_items = order.orderitem_set.all()
            formatted_items = [
                {
                    "name": item.product.name,
                    "quantity": item.quantity,
                    "price": int(item.product.price),
                }
                for item in order_items
            ]

            formatted_orders.append({
                "orderId": f"TRSMK-{order.id:06d}",
                "date": localtime(order.created_at).strftime("%Y-%m-%dT%H:%M:%S"),
                # "date": order.created_at.strftime("%Y-%m-%dT%H:%M:%S"),
                "status": "Selesai",
                "items": formatted_items,
                "total": int(order.total)
            })

        return JsonResponse({"success": True, "orders": formatted_orders})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

@login_required
def api_cart_items(request):
    cart_items = CartItem.objects.filter(cart__user=request.user)
    items = []
    total = 0

    for item in cart_items:
        total_price = item.get_total_price()
        items.append({
            "product_name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "total_price": total_price,
        })
        total += total_price

    return JsonResponse({
        "items": items,
        "total": total
    })
