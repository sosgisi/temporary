
document.addEventListener('DOMContentLoaded', () => {
  window.updateAuthUI();

  const saved = JSON.parse(localStorage.getItem("lastOrderSummary")) || {};
  const orderDetails = {
    orderNumber: saved.orderNumber || "#TRSMK-XXXXX",
    paymentMethod: saved.paymentMethod || "Transfer Bank",
    shippingAddress: saved.shippingAddress || "Alamat tidak tersedia",
    deliveryEstimate: saved.deliveryEstimate || "2-4 hari kerja",
    finalTotalPrice: saved.finalTotalPrice || 0
  };

  document.getElementById('orderNumber').textContent = orderDetails.orderNumber;
  document.getElementById('paymentMethod').textContent = orderDetails.paymentMethod;
  document.getElementById('shippingAddress').textContent = orderDetails.shippingAddress;
  document.getElementById('deliveryEstimate').textContent = orderDetails.deliveryEstimate;
  document.getElementById('finalTotalPrice').textContent = `Rp ${orderDetails.finalTotalPrice.toLocaleString('id-ID')}`;

  const currentUser = window.loadUserFromLocalStorage();
  if (currentUser) {
    const cartKey = `cart_${currentUser.username}`;
    localStorage.removeItem(cartKey);
    localStorage.removeItem('lastOrderSummary');
  }
});
