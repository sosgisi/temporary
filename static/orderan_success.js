// order_success.js
document.addEventListener('DOMContentLoaded', () => {
    window.updateAuthUI();

    const mockOrderDetails = {
        orderNumber: "#TRSMK-" + Math.floor(Math.random() * 100000),
        paymentMethod: "Transfer Bank BCA",
        shippingAddress: "Jl. Contoh No. 123, Perumahan Indah, Blok A1, Kota Contoh, Provinsi Contoh, 12345",
        deliveryEstimate: "2-4 hari kerja",
        finalTotalPrice: parseFloat(localStorage.getItem('lastOrderTotal')) || 0
    };

    const orderNumberElem = document.getElementById('orderNumber');
    const paymentMethodElem = document.getElementById('paymentMethod');
    const shippingAddressElem = document.getElementById('shippingAddress');
    const deliveryEstimateElem = document.getElementById('deliveryEstimate');
    const finalTotalPriceElem = document.getElementById('finalTotalPrice');

    if (orderNumberElem) orderNumberElem.textContent = mockOrderDetails.orderNumber;
    if (paymentMethodElem) paymentMethodElem.textContent = mockOrderDetails.paymentMethod;
    if (shippingAddressElem) shippingAddressElem.textContent = mockOrderDetails.shippingAddress;
    if (deliveryEstimateElem) deliveryEstimateElem.textContent = mockOrderDetails.deliveryEstimate;
    if (finalTotalPriceElem) finalTotalPriceElem.textContent = `Rp ${mockOrderDetails.finalTotalPrice.toLocaleString('id-ID')}`;

    const currentUser = window.loadUserFromLocalStorage();
    if (currentUser) {
        const cartKey = `cart_${currentUser.username}`;
        localStorage.removeItem(cartKey);
        localStorage.removeItem('lastOrderTotal');
        console.log('Keranjang pengguna telah dikosongkan setelah pembayaran berhasil.');
    }

    // --- Menambahkan kembali event listener global dari dashboard.js ---
    document.getElementById('btnLogin')?.addEventListener('click', window.showLoginModal);
    document.getElementById('btnRegister')?.addEventListener('click', window.showRegisterModal);

    const accountMenu = document.getElementById('accountMenu');
    const accountDropdown = document.getElementById('accountDropdown');
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener('click', function(e) {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
            e.stopPropagation();
        });
        document.addEventListener('click', function(e) {
            if (!accountMenu.contains(e.target) && accountDropdown.style.display === 'block') {
                accountDropdown.style.display = 'none';
            }
        });
    }

    document.getElementById('logoutBtn')?.addEventListener('click', window.logout);

    document.getElementById('closeAuthModal')?.addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'none';
    });

    document.getElementById('showRegister')?.addEventListener('click', () => window.showForm('register'));
    document.getElementById('showLoginFromRegister')?.addEventListener('click', () => window.showForm('login'));
    document.getElementById('showForgotPassword')?.addEventListener('click', () => window.showForm('forgot'));
    document.getElementById('showLoginFromForgot')?.addEventListener('click', () => window.showForm('login'));

    document.getElementById('btnLoginSubmit')?.addEventListener('click', window.login);
    document.getElementById('btnRegisterSubmit')?.addEventListener('click', window.register);
    document.getElementById('btnResetPassword')?.addEventListener('click', window.resetPassword);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                window.location.href = `/?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }
});