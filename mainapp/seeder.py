from mainapp.models import Product, Category
import random

def run():
    # Hapus data lama
    Product.objects.all().delete()
    Category.objects.all().delete()

    # Buat beberapa category dummy
    category_names = ['Makanan', 'Minuman', 'Perawatan', 'Elektronik']
    categories = []
    for cat_name in category_names:
        cat = Category.objects.create(name=cat_name)
        categories.append(cat)

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
            image='https://via.placeholder.com/150',
            category=random.choice(categories)  # Assign random category
        )
    print("✅ Dummy produk dengan category berhasil dibuat.")