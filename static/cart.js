// cart.js - This file contains cart-specific logic and relies on dashboard.js for global functions

// --- DOM Elements ---
// Mendapatkan referensi ke semua elemen DOM yang relevan untuk halaman keranjang
const cartListContainer = document.getElementById('cartListContainer');
const cartSubtotalElem = document.getElementById('cartSubtotal');
const cartShippingElem = document.getElementById('cartShipping');
const cartTotalElem = document.getElementById('cartTotal');
const cartEmptyMessage = document.getElementById('cartEmptyMessage');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartSummaryElement = document.getElementById('cartSummary');

// Biaya pengiriman yang konsisten, diasumsikan dalam IDR
const SHIPPING_COST = 15000;

// Catatan: Variabel 'products' diasumsikan tersedia secara global dari dashboard.js
// atau skrip lain yang memuat data produk.
// Contoh strukturnya: const products = [{ id: 1, name: 'Product A', price: 100000, stock: 10, image: '...' }];

/**
 * Merender item-item di keranjang dan memperbarui ringkasan total.
 * Fungsi ini diekspos secara global (melalui `window`) agar bisa dipanggil dari skrip lain (misalnya setelah login atau tambah ke keranjang).
 */
window.renderCart = function() {
    const currentUser = window.loadUserFromLocalStorage();
    const cartKey = currentUser ? `cart_${currentUser.username}` : null;
    let cart = cartKey ? (JSON.parse(localStorage.getItem(cartKey)) || []) : [];

    // --- Validasi Eksistensi Elemen DOM ---
    // Periksa apakah semua elemen DOM yang diperlukan ada di halaman.
    // Jika tidak ada, tampilkan peringatan di konsol dan hentikan rendering.
    if (!cartListContainer || !cartSubtotalElem || !cartShippingElem || !cartTotalElem || !cartEmptyMessage || !clearCartBtn || !checkoutBtn || !cartSummaryElement) {
        console.warn('Satu atau lebih elemen DOM keranjang tidak ditemukan. Rendering keranjang mungkin tidak lengkap.');
        return;
    }

    // --- Logika Tampilan Berdasarkan Status Pengguna dan Keranjang ---

    // Kondisi: Pengguna belum login
    if (!currentUser) {
        cartEmptyMessage.style.display = 'block';
        cartEmptyMessage.innerHTML = '<p class="text-secondary text-center">Anda harus login untuk melihat keranjang. Kembali ke <a href="/">Dashboard</a>.</p>';
        cartListContainer.style.display = 'none';
        cartSummaryElement.style.display = 'none';
        clearCartBtn.style.display = 'none';
        checkoutBtn.style.display = 'none';
        cartSubtotalElem.textContent = 'Rp 0';
        cartShippingElem.textContent = 'Rp 0';
        cartTotalElem.textContent = 'Rp 0';
        return;
    }

    // Bersihkan item yang sudah ada di kontainer keranjang sebelum merender ulang
    cartListContainer.innerHTML = '';

    // Kondisi: Keranjang kosong setelah login
    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartEmptyMessage.innerHTML = '<p class="text-secondary text-center">Keranjang Anda kosong. Kembali ke <a href="/">Dashboard</a>.</p>';
        cartListContainer.style.display = 'none';
        cartSummaryElement.style.display = 'none';
        clearCartBtn.style.display = 'none';
        checkoutBtn.style.display = 'none';
        cartSubtotalElem.textContent = 'Rp 0';
        cartShippingElem.textContent = 'Rp 0';
        cartTotalElem.textContent = 'Rp 0';
        return;
    }

    // Kondisi: Keranjang memiliki item dan pengguna sudah login
    cartEmptyMessage.style.display = 'none';
    cartListContainer.style.display = 'block';
    cartSummaryElement.style.display = 'block';
    clearCartBtn.style.display = 'block';
    checkoutBtn.style.display = 'block';

    let subtotal = 0;

    // Iterasi setiap item di keranjang untuk ditampilkan dan menghitung subtotal
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemCard = document.createElement('div');
        cartItemCard.classList.add('cart-product-card'); // Tambahkan kelas CSS untuk styling
        cartItemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-product-details">
                <h4>${item.name}</h4>
                <p>Harga Satuan: Rp ${item.price.toLocaleString('id-ID')}</p>
                <p class="cart-product-price-total">Total: Rp ${itemTotal.toLocaleString('id-ID')}</p>
                <div class="cart-item-controls">
                    <button class="btn btn-sm btn-secondary decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-primary increase-quantity" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">Hapus</button>
                </div>
            </div>
        `;
        cartListContainer.appendChild(cartItemCard);
    });

    // Perbarui elemen ringkasan (subtotal, ongkir, total)
    cartSubtotalElem.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    cartShippingElem.textContent = `Rp ${SHIPPING_COST.toLocaleString('id-ID')}`;
    cartTotalElem.textContent = `Rp ${(subtotal + SHIPPING_COST).toLocaleString('id-ID')}`;

    // Lampirkan event listener setelah semua item keranjang dirender
    attachCartItemListeners();
};

/**
 * Melampirkan event listener ke tombol kontrol item keranjang (+, -, Hapus).
 * Fungsi ini harus dipanggil setiap kali item keranjang dirender atau dirender ulang,
 * karena elemen-elemen ini dibuat secara dinamis.
 */
function attachCartItemListeners() {
    // Tombol 'Tambah Kuantitas'
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.onclick = (event) => { // Menggunakan .onclick lebih sederhana untuk elemen dinamis
            const id = parseInt(event.target.dataset.id);
            updateCartQuantity(id, 1);
        };
    });

    // Tombol 'Kurangi Kuantitas'
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.onclick = (event) => {
            const id = parseInt(event.target.dataset.id);
            updateCartQuantity(id, -1);
        };
    });

    // Tombol 'Hapus Item'
    document.querySelectorAll('.remove-item').forEach(button => {
        button.onclick = (event) => {
            const id = parseInt(event.target.dataset.id);
            removeItemFromCart(id);
        };
    });
}

/**
 * Memperbarui kuantitas produk di keranjang.
 * @param {number} productId - ID produk yang akan diperbarui.
 * @param {number} change - Jumlah perubahan kuantitas (+1 atau -1).
 */
function updateCartQuantity(productId, change) {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast('Silakan login untuk mengubah keranjang.', 'error');
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        // 'products' diharapkan menjadi array global dari dashboard.js
        // Pastikan array 'products' tersedia dan item ada di dalamnya untuk validasi stok
        if (typeof products === 'undefined' || !Array.isArray(products)) {
            console.error('Array "products" global tidak ditemukan. Tidak dapat memvalidasi stok.');
            window.showToast('Data produk tidak tersedia untuk validasi stok.', 'error');
            return;
        }

        const productInCatalog = products.find(p => p.id === productId);
        if (!productInCatalog) {
            window.showToast('Produk tidak ditemukan di katalog.', 'error');
            return;
        }

        const currentQuantity = cart[itemIndex].quantity;
        const newQuantity = currentQuantity + change;

        // Validasi kuantitas baru: harus > 0 dan tidak melebihi stok (jika stok didefinisikan)
        if (newQuantity > 0 && (productInCatalog.stock === undefined || newQuantity <= productInCatalog.stock)) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem(cartKey, JSON.stringify(cart));
            window.showToast(`Kuantitas ${cart[itemIndex].name} diperbarui.`, 'info');
            window.renderCart(); // Render ulang keranjang untuk memperbarui UI
        } else if (newQuantity <= 0) {
            // Jika kuantitas menjadi 0 atau kurang, hapus item dari keranjang
            removeItemFromCart(productId);
            // renderCart akan dipanggil oleh removeItemFromCart, jadi kita bisa keluar dari sini
            return;
        } else if (productInCatalog.stock !== undefined && newQuantity > productInCatalog.stock) {
            // Jika kuantitas melebihi stok yang tersedia
            window.showToast(`Stok ${productInCatalog.name} hanya ${productInCatalog.stock}.`, 'error');
        }
    } else {
        window.showToast('Produk tidak ditemukan di keranjang.', 'error');
    }
}

/**
 * Menghapus produk sepenuhnya dari keranjang.
 * @param {number} productId - ID produk yang akan dihapus.
 */
function removeItemFromCart(productId) {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast('Anda harus login untuk menghapus item dari keranjang.', 'error');
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const initialLength = cart.length;
    // Filter keranjang, hanya sisakan item yang ID-nya tidak cocok dengan productId
    cart = cart.filter(item => item.id !== productId);

    if (cart.length < initialLength) {
        // Jika ada item yang benar-benar dihapus
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.showToast('Produk berhasil dihapus dari keranjang.');
        window.renderCart(); // Render ulang keranjang untuk memperbarui UI
    } else {
        window.showToast('Produk tidak ditemukan di keranjang.', 'error');
    }
}

/**
 * Mengosongkan seluruh keranjang untuk pengguna saat ini.
 */
function handleClearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang?')) {
        const currentUser = window.loadUserFromLocalStorage();
        if (currentUser) {
            const cartKey = `cart_${currentUser.username}`;
            localStorage.removeItem(cartKey); // Hapus data keranjang dari localStorage
            window.showToast('Keranjang telah dikosongkan.', 'info');
            window.renderCart(); // Render ulang keranjang
        } else {
            window.showToast('Anda harus login untuk mengosongkan keranjang.', 'error');
        }
    }
}

/**
 * Menangani klik tombol checkout, memvalidasi pengguna dan keranjang sebelum mengarahkan ke halaman checkout.
 */
function handleCheckout() {
    const currentUser = window.loadUserFromLocalStorage();
    if (!currentUser) {
        window.showToast('Anda harus login untuk checkout.', 'error');
        window.showLoginModal(); // Tawarkan login jika belum login
        return;
    }

    const cartKey = `cart_${currentUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cart.length === 0) {
        window.showToast('Keranjang Anda kosong. Tambahkan produk terlebih dahulu!', 'error');
        return;
    }

    // Arahkan ke halaman checkout
    window.location.href = '/checkout/';
}

// --- Event Listeners Global dan Inisialisasi ---
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi tampilan UI otentikasi header (ditangani oleh dashboard.js)
    window.updateAuthUI();

    // Event listener untuk tombol otentikasi di header
    document.getElementById('btnLogin')?.addEventListener('click', window.showLoginModal);
    document.getElementById('btnRegister')?.addEventListener('click', window.showRegisterModal);

    // Event listener untuk dropdown menu akun
    const accountMenu = document.getElementById('accountMenu');
    const accountDropdown = document.getElementById('accountDropdown');
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener('click', function(e) {
            // Toggle tampilan dropdown
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
            e.stopPropagation(); // Mencegah klik dokumen segera menutupnya
        });
        document.addEventListener('click', function(e) {
            // Tutup dropdown jika klik di luar menu dan dropdown sedang terbuka
            if (!accountMenu.contains(e.target) && accountDropdown.style.display === 'block') {
                accountDropdown.style.display = 'none';
            }
        });
    }
    // Event listener untuk tombol logout
    document.getElementById('logoutBtn')?.addEventListener('click', window.logout);

    // Event listener untuk tombol tutup modal otentikasi
    document.getElementById('closeAuthModal')?.addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'none';
    });

    // Event listener untuk navigasi form otentikasi (login/register/lupa password)
    document.getElementById('showRegister')?.addEventListener('click', () => window.showForm('register'));
    document.getElementById('showLoginFromRegister')?.addEventListener('click', () => window.showForm('login'));
    document.getElementById('showForgotPassword')?.addEventListener('click', () => window.showForm('forgot'));
    document.getElementById('showLoginFromForgot')?.addEventListener('click', () => window.showForm('login'));

    // Event listener untuk submit form otentikasi
    document.getElementById('btnLoginSubmit')?.addEventListener('click', window.login);
    document.getElementById('btnRegisterSubmit')?.addEventListener('click', window.register);
    document.getElementById('btnResetPassword')?.addEventListener('click', window.resetPassword);

    // --- Logika Khusus Halaman Keranjang ---
    window.renderCart(); // Panggil rendering keranjang saat halaman dimuat

    // Lampirkan event listener ke tombol 'Clear Cart' dan 'Checkout'
    clearCartBtn?.addEventListener('click', handleClearCart);
    checkoutBtn?.addEventListener('click', handleCheckout);

    // Fungsionalitas pencarian di header
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                // Arahkan ke dashboard dengan parameter pencarian
                // Menggunakan '/' memastikan pengarahan ke root URL (view 'home' Django)
                window.location.href = `/?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }
});