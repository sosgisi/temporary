# store/seeder.py
from mainapp.models import Product
import random

def run():
    Product.objects.all().delete()  # Opsional: kosongkan dulu
    names = ['Beras 5kg', 'Minyak Goreng 1L', 'Sabun Mandi', 'Susu UHT', 'Mi Instan']
    descriptions = [
        'Beras pulen kualitas premium.',
        'Minyak goreng sehat untuk memasak.',
        'Sabun wangi untuk kulit lembut.',
        'Susu segar penuh gizi.',
        'Mi instan rasa ayam lezat.'
    ]
    for i in range(10):
        Product.objects.create(
            name=random.choice(names) + f' {i+1}',
            description=random.choice(descriptions),
            price=random.randint(5000, 50000),
            stock=random.randint(5, 100),
            image='https://via.placeholder.com/150'  # Dummy image
        )
    print("✅ Dummy produk berhasil dibuat.")