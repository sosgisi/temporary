
document.addEventListener("DOMContentLoaded", () => {
  fetchCheckoutItems();

  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", submitOrder);
  }
});

function fetchCheckoutItems() {
  fetch("/api/cart-items/", {
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
  })
    .then(res => res.json())
    .then(data => {
      renderCheckoutItems(data.items);
      updateCheckoutSummary(data.total);
    });
}

function renderCheckoutItems(items) {
  const container = document.getElementById("checkoutItems");
  container.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkout-item";
    div.innerHTML = `
      <p>${item.quantity}x ${item.product_name} <span>Rp ${item.total_price}</span></p>
    `;
    container.appendChild(div);
  });
}

function updateCheckoutSummary(total) {
  const shipping = 0;
  const totalWithShipping = total + shipping;

  document.getElementById("checkoutSubtotal").innerText = `Rp ${total}`;
  document.getElementById("checkoutShipping").innerText = `Rp ${shipping}`;
  document.getElementById("checkoutTotal").innerText = `Rp ${totalWithShipping}`;
}

function submitOrder() {
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const successUrl = document.getElementById("placeOrderBtn").getAttribute("data-success-url");

  if (!address || !city || !postalCode) {
    showToast("Mohon lengkapi alamat pengiriman.");
    return;
  }

  fetch("/api/checkout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken()
    },
    body: JSON.stringify({
      address,
      city,
      postal_code: postalCode,
      payment_method: paymentMethod
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const totalAmountText = document.getElementById("checkoutTotal").innerText;
        const finalTotal = parseInt(totalAmountText.replace(/[^\d]/g, '')) || 0;
        const fullAddress = `${address}, ${city}, ${postalCode}`;

        const orderData = {
          orderNumber: "#TRSMK-" + Math.floor(Math.random() * 100000),
          paymentMethod: paymentMethod || "Transfer Bank",
          shippingAddress: fullAddress,
          deliveryEstimate: "2-4 hari kerja",
          finalTotalPrice: finalTotal
        };

        localStorage.setItem("lastOrderSummary", JSON.stringify(orderData));
        window.location.href = successUrl;
      } else {
        showToast(data.error || "Terjadi kesalahan saat checkout.");
      }
    });
}

function getCSRFToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}
