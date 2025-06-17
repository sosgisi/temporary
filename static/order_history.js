// order_history.js
document.addEventListener('DOMContentLoaded', () => {
    // Memastikan fungsi-fungsi global dari dashboard.js dimuat
    window.updateAuthUI();
    // Jika perlu, Anda bisa memanggil `window.setupAuthModals()` di sini
    // jika halaman riwayat pesanan juga memiliki modal login/register yang perlu diinisialisasi.

    const orderListDiv = document.getElementById('order-list');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const noOrdersMessage = document.getElementById('noOrdersMessage');

    let ordersData = []; // Akan diisi dengan data pesanan pengguna
    let ordersPerPage = 5;
    let currentPage = 0;

    /**
     * Mengambil data pesanan dari localStorage berdasarkan pengguna yang login.
     * Dalam aplikasi nyata, ini akan menjadi panggilan API ke backend.
     */
    function fetchUserOrders() {
        const currentUser = window.loadUserFromLocalStorage(); // Fungsi dari dashboard.js
        if (!currentUser) {
            // Pengguna belum login, tampilkan pesan dan sembunyikan elemen terkait
            noOrdersMessage.style.display = 'block';
            noOrdersMessage.innerHTML = '<p class="text-secondary text-center">Anda harus login untuk melihat riwayat pesanan. Kembali ke <a href="/">Dashboard</a>.</p>';
            orderListDiv.innerHTML = ''; // Pastikan tidak ada konten sebelumnya
            loadMoreBtn.style.display = 'none';
            return [];
        }

        const ordersKey = `orders_${currentUser.username}`;
        // Ambil data pesanan dari localStorage. Jika tidak ada, kembalikan array kosong.
        // Data pesanan dummy di sini untuk demonstrasi
        let userOrders = JSON.parse(localStorage.getItem(ordersKey)) || generateDummyOrders(15);
        
        // Simpan kembali dummy data ke localStorage jika belum ada, agar konsisten
        if (!localStorage.getItem(ordersKey)) {
            localStorage.setItem(ordersKey, JSON.stringify(userOrders));
        }

        // Urutkan pesanan terbaru lebih dulu (opsional, tapi bagus untuk riwayat)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        return userOrders;
    }

    // Fungsi dummy untuk menghasilkan data pesanan palsu (mirip dengan yang di awal)
    function generateDummyOrders(count) {
        const dummyOrders = [];
        const productNames = [
            "Beras Premium", "Minyak Goreng", "Susu UHT", "Telur Ayam", "Kopi Instan",
            "Sabun Mandi", "Pasta Gigi", "Deterjen Pakaian", "Obat Nyamuk Semprot", "Snack Kentang"
        ];
        const statusOptions = ['Selesai', 'Diproses', 'Dikirim', 'Dibatalkan', 'Pending'];

        for (let i = 0; i < count; i++) {
            const orderId = `TRSMK-${Math.floor(Math.random() * 1000000000).toString(36).substring(0, 8).toUpperCase()}`;
            const date = new Date(Date.now() - (i * (2 + Math.random()) * 24 * 60 * 60 * 1000)); // Pesanan lebih lama
            const orderDateFormatted = date.toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

            const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per order
            const items = [];
            let total = 0;

            for (let j = 0; j < numItems; j++) {
                const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
                const price = Math.floor(Math.random() * 50000) + 5000; // Harga acak
                const quantity = Math.floor(Math.random() * 3) + 1; // Jumlah acak
                items.push({ name: randomProduct, price: price, quantity: quantity });
                total += price * quantity;
            }

            dummyOrders.push({ orderId, date: orderDateFormatted, status, items, total });
        }
        return dummyOrders;
    }

    /**
     * Merender daftar pesanan ke DOM.
     * Menampilkan sejumlah pesanan per halaman dan mengelola tombol "Muat Lebih Banyak".
     */
    function renderOrders() {
        const startIndex = currentPage * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const ordersToDisplay = ordersData.slice(startIndex, endIndex);

        if (ordersToDisplay.length === 0 && currentPage === 0) {
            noOrdersMessage.style.display = 'block';
            loadMoreBtn.style.display = 'none';
            return;
        } else {
            noOrdersMessage.style.display = 'none';
        }

        ordersToDisplay.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            let itemsHtml = order.items.map(item => `
                <div class="item">
                    <span>${item.name} (${item.quantity}x)</span>
                    <span>Rp ${item.price.toLocaleString('id-ID')}</span>
                </div>
            `).join('');

            orderCard.innerHTML = `
                <h3>Pesanan #${order.orderId}</h3>
                <p><strong>Tanggal Pesanan:</strong> ${order.date}</p>
                <p><strong>Status:</strong> <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></p>
                <div class="items-list">
                    <h4>Detail Item:</h4>
                    ${itemsHtml}
                </div>
                <p class="total">Total Pesanan: Rp ${order.total.toLocaleString('id-ID')}</p>
            `;
            orderListDiv.appendChild(orderCard);
        });

        // Tampilkan/Sembunyikan tombol "Muat Lebih Banyak"
        if (endIndex >= ordersData.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Event listener untuk tombol "Muat Lebih Banyak"
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderOrders();
    });

    // Inisialisasi halaman saat DOM selesai dimuat
    ordersData = fetchUserOrders();
    renderOrders();
});