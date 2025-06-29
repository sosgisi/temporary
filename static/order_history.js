document.addEventListener("DOMContentLoaded", async () => {
    console.log('order_history loaded')
    if (window.updateAuthUI) {
        window.updateAuthUI(); // akan otomatis mengatur authButtons dan accountMenu
    } else {
        await checkLoginStatus(); // fallback jika fungsi global tidak tersedia
    }
    const orderListDiv = document.getElementById("order-list");
    const noOrdersMessage = document.getElementById("noOrdersMessage");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    let orders = [];
    let page = 0;
    const perPage = 5;

    async function fetchOrders() {
        try {
            const res = await fetch("/api/order-history/", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.orders)) {
                orders = data.orders;
                renderNextPage();
            } else {
                console.warn("Data order tidak valid:", data);
                noOrdersMessage.style.display = "block";
            }
        } catch (err) {
            console.error("Gagal mengambil riwayat pesanan:", err);
            noOrdersMessage.style.display = "block";
        }
    }

    async function checkLoginStatus() {
        try {
            const res = await fetch('/api/get_current_user/', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();

            const authButtons = document.getElementById('authButtons');
            const accountMenu = document.getElementById('accountMenu');
            const accountUsername = document.getElementById('accountUsername');

            if (data.is_authenticated) {
                if (authButtons) authButtons.style.display = 'none';
                if (accountMenu) accountMenu.style.display = 'flex';
                if (accountUsername) accountUsername.textContent = data.username;
            } else {
                if (authButtons) authButtons.style.display = 'flex';
                if (accountMenu) accountMenu.style.display = 'none';
                if (accountUsername) accountUsername.textContent = '';
            }
        } catch (err) {
            console.error('Gagal memeriksa status login:', err);
        }
    }

    function renderNextPage() {
        const start = page * perPage;
        const end = start + perPage;
        const slice = orders.slice(start, end);

        if (slice.length === 0 && page === 0) {
            noOrdersMessage.style.display = "block";
            return;
        }

        noOrdersMessage.style.display = "none";

        slice.forEach((order) => {
        const card = document.createElement("div");
        card.classList.add("order-card");

        let itemHTML = order.items
            .map(
            (item) =>
                `<div class="item">
                <span>${item.name} (${item.quantity}x)</span>
                <span>Rp ${item.price.toLocaleString("id-ID")}</span>
                </div>`
            )
            .join("");

        const formattedDate = new Date(order.date).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        card.innerHTML = `
            <h3>Pesanan #${order.orderId}</h3>
            <p><strong>Tanggal Pesanan:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> <span class="status-badge">${order.status}</span></p>
            <div class="items-list">
            <h4>Detail Item:</h4>
            ${itemHTML}
            </div>
            <p class="total">Total Pesanan: Rp ${order.total.toLocaleString("id-ID")}</p>
        `;
        orderListDiv.appendChild(card);
        });

        page++;
        if (orders.length > page * perPage) {
            loadMoreBtn.style.display = "block";
        } else {
            loadMoreBtn.style.display = "none";
        }
    }

    loadMoreBtn.addEventListener("click", () => {
        renderNextPage();
    });

    fetchOrders();
});