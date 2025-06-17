// dashboard.js - This file will contain global functions and dashboard specific logic
console.log("dashboard.js loaded");
// Global variables (mock data for products and users)
const products = [
  {
    id: 1,
    name: "Beras Premium",
    price: 12000,
    description:
      "Beras kualitas premium 5kg. Beras ini dipilih dari varietas terbaik, diolah dengan teknologi modern untuk menghasilkan bulir beras yang utuh dan bersih. Cocok untuk konsumsi sehari-hari keluarga.",
    category: "Kebutuhan Pokok",
    image: "https://cdn-icons-png.flaticon.com/512/1256/1256425.png",
    stock: 50, // Added stock for realistic cart logic
  },
  {
    id: 2,
    name: "Minyak Goreng",
    price: 15000,
    description:
      "Minyak goreng kemasan 1L. Terbuat dari kelapa sawit pilihan, kaya akan Vitamin A dan D. Ideal untuk menggoreng dan menumis, memberikan rasa gurih pada masakan Anda.",
    category: "Kebutuhan Pokok",
    image: "https://cdn-icons-png.flaticon.com/512/2938/2938499.png",
    stock: 30, // Added stock for realistic cart logic
  },
  {
    id: 3,
    name: "Susu UHT",
    price: 8000,
    description:
      "Susu UHT rasa coklat 200ml. Susu siap minum dengan rasa coklat yang lezat, diperkaya vitamin dan mineral. Praktis dibawa ke mana saja untuk sumber energi instan.",
    category: "Minuman",
    image: "https://cdn-icons-png.flaticon.com/512/2739/2739178.png",
    stock: 100, // Added stock for realistic cart logic
  },
  {
    id: 4,
    name: "Telur Ayam",
    price: 28000,
    description:
      "Telur ayam negeri 1 lusin. Sumber protein hewani yang murah dan mudah didapat. Cocok untuk berbagai olahan masakan.",
    category: "Kebutuhan Pokok",
    image: "https://cdn-icons-png.flaticon.com/512/3209/3209028.png",
    stock: 20, // Added stock for realistic cart logic
  },
  {
    id: 5,
    name: "Kopi Instan",
    price: 9500,
    description:
      "Kopi instan sachet. Praktis untuk dinikmati kapan saja. Rasakan sensasi kopi nikmat di setiap tegukan.",
    category: "Minuman",
    image: "https://cdn-icons-png.flaticon.com/512/924/924765.png",
    stock: 75, // Added stock for realistic cart logic
  },
  {
    id: 6,
    name: "Sabun Mandi",
    price: 7000,
    description:
      "Sabun mandi batangan dengan aroma lavender. Memberikan keharuman dan kesegaran sepanjang hari. Cocok untuk kulit sensitif.",
    category: "Perlengkapan Mandi",
    image: "https://cdn-icons-png.flaticon.com/512/3035/3035974.png",
    stock: 40, // Added stock for realistic cart logic
  },
  {
    id: 7,
    name: "Pasta Gigi",
    price: 12000,
    description:
      "Pasta gigi dengan formula perlindungan total. Melindungi gigi dari gigi berlubang dan bau mulut. Nafas segar sepanjang hari.",
    category: "Perlengkapan Mandi",
    image: "https://cdn-icons-png.flaticon.com/512/575/575314.png",
    stock: 60, // Added stock for realistic cart logic
  },
  {
    id: 8,
    name: "Deterjen Pakaian",
    price: 25000,
    description:
      "Deterjen bubuk konsentrat 500g. Membersihkan pakaian lebih bersih dan efektif. Pakaian wangi dan bebas noda membandel.",
    category: "Pembersih Rumah",
    image: "https://cdn-icons-png.flaticon.com/512/2553/2553655.png",
    stock: 25, // Added stock for realistic cart logic
  },
  {
    id: 9,
    name: "Obat Nyamuk Semprot",
    price: 18000,
    description:
      "Obat nyamuk semprot efektif usir nyamuk dan serangga. Perlindungan maksimal untuk keluarga. Aman digunakan di dalam ruangan.",
    category: "Pembersih Rumah",
    image: "https://cdn-icons-png.flaticon.com/512/488/488737.png",
    stock: 35, // Added stock for realistic cart logic
  },
  {
    id: 10,
    name: "Snack Kentang",
    price: 8500,
    description:
      "Snack kentang renyah dengan rasa balado. Cocok untuk camilan saat bersantai. Teman ngopi yang pas.",
    category: "Camilan",
    image: "https://cdn-icons-png.flaticon.com/512/820/820150.png",
    stock: 80, // Added stock for realistic cart logic
  },
];

// Auth related DOM elements
const authButtons = document.getElementById("authButtons");
const accountMenu = document.getElementById("accountMenu");
const accountUsername = document.getElementById("accountUsername");
const logoutBtn = document.getElementById("logoutBtn");
const authModal = document.getElementById("authModal");
const closeAuthModal = document.getElementById("closeAuthModal");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const showRegisterLink = document.getElementById("showRegister");
const showLoginFromRegisterLink = document.getElementById(
  "showLoginFromRegister"
);
const showForgotPasswordLink = document.getElementById("showForgotPassword");
const showLoginFromForgotLink = document.getElementById("showLoginFromForgot");
// const btnLoginSubmit = document.getElementById('btnLoginSubmit');
// const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
// const btnResetPassword = document.getElementById('btnResetPassword');
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const regUsernameInput = document.getElementById("regUsername");
const regNameInput = document.getElementById("regName");
const regEmailInput = document.getElementById("regEmail");
const regPhoneInput = document.getElementById("regPhone");
const regPasswordInput = document.getElementById("regPassword");
const forgotIdInput = document.getElementById("forgotId");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const forgotError = document.getElementById("forgotError");
const toast = document.getElementById("toast");

// Buttons to switch forms
const showRegisterFromLogin = document.getElementById("showRegisterFromLogin");
const showLoginFromRegister = document.getElementById("showLoginFromRegister");
const showForgotFromLogin = document.getElementById("showForgotFromLogin");
const showLoginFromForgot = document.getElementById("showLoginFromForgot");
const showVerifyOtpFromLogin = document.getElementById(
  "showVerifyOtpFromLogin"
); // Added this if you want a direct link to OTP form
const showLoginFromOtp = document.getElementById("showLoginFromOtp");

// New OTP related DOM elements
const otpVerificationForm = document.getElementById("otpVerificationForm");
const otpInput = document.getElementById("otpInput");
const otpMessage = document.getElementById("otpMessage");
const otpError = document.getElementById("otpError");
// let btnVerifyOtp = document.getElementById('btnVerifyOtp');
const btnResendOtp = document.getElementById("btnResendOtp");
const showLoginFromOtpLink = document.getElementById("showLoginFromOtp");

// Temporary storage for user registration/reset data during OTP flow
let tempUserData = null;
let currentOtp = null; // This will now be set to a fixed value for simulation
let otpPurpose = null; // 'register' or 'reset'
let currentOtpUserIdentifier = null; // Menyimpan email/phone tujuan OTP

// Product Detail Modal DOM elements
const productDetailModal = document.getElementById("productDetailModal");
const closeDetailModal = document.getElementById("closeDetailModal");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById(
  "modalProductDescription"
);
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductStock = document.getElementById("modalProductStock");
const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");

// Dashboard specific DOM elements
const catalogContainer = document.getElementById("catalog");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const accountDropdown = document.getElementById("accountDropdown");

// --- Global Utility Functions ---

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info'.
 */
window.showToast = function (message, type = "info") {
  if (!toast) return; // Ensure toast element exists
  toast.textContent = message;
  toast.className = "toast show " + type;
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
};

/**
 * Loads the current user from Local Storage.
 * @returns {object|null} The current user object or null if not logged in.
 */
window.loadUserFromLocalStorage = function () {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

/**
 * Saves the current user to Local Storage.
 * @param {object|null} user - The user object to save, or null to clear.
 */
window.saveUserToLocalStorage = function (user) {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
};

/**
 * Updates the authentication UI based on current user status.
 */
window.updateAuthUI = function () {
  const currentUser = window.loadUserFromLocalStorage();
  if (authButtons && accountMenu && accountUsername) {
    if (currentUser) {
      authButtons.style.display = "none";
      accountMenu.style.display = "flex";
      accountUsername.textContent = currentUser.username; // Or currentUser.name
      updateAddToCartButtonsVisibility(true); // Show add to cart buttons
    } else {
      authButtons.style.display = "flex";
      accountMenu.style.display = "none";
      accountUsername.textContent = "";
      updateAddToCartButtonsVisibility(false); // Hide add to cart buttons
    }
  }
};

function updateAddToCartButtonsVisibility(isLoggedIn) {
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    // btn.style.display = isLoggedIn ? 'block' : 'none'; diganti
    btn.style.display = "block";
  });
  if (modalAddToCartBtn) {
    // modalAddToCartBtn.style.display = isLoggedIn ? 'block' : 'none'; diganti
    modalAddToCartBtn.style.display = "block";
  }
}

/**
 * Shows a specific authentication form (login, register, forgot password, otp verification) in the modal.
 * @param {string} formName - 'login', 'register', 'forgot', or 'otp'.
 */
window.showForm = function (formName) {
  console.log(formName);
  if (loginForm) loginForm.style.display = "none";
  if (registerForm) registerForm.style.display = "none";
  if (forgotPasswordForm) forgotPasswordForm.style.display = "none";
  if (otpVerificationForm) otpVerificationForm.style.display = "none";

  // Clear all error/info messages
  if (loginError) loginError.textContent = "";
  if (registerError) registerError.textContent = "";
  if (forgotError) forgotError.textContent = "";
  if (otpMessage) otpMessage.textContent = "";
  if (otpError) otpError.textContent = "";

  if (formName === "login" && loginForm) {
    loginForm.style.display = "block";
  } else if (formName === "register" && registerForm) {
    registerForm.style.display = "block";
  } else if (formName === "forgot" && forgotPasswordForm) {
    forgotPasswordForm.style.display = "block";
  } else if (formName === "otp" && otpVerificationForm) {
    otpVerificationForm.style.display = "block";
  }
};

/**
 * Shows the login modal.
 */
window.showLoginModal = function () {
  if (authModal) authModal.style.display = "flex";
  window.showForm("login");
};

/**
 * Shows the register modal.
 */
window.showRegisterModal = function () {
  if (authModal) authModal.style.display = "flex";
  window.showForm("register");
};

/**
 * Shows the forgot password modal.
 */
window.showForgotPasswordModal = function () {
  if (authModal) authModal.style.display = "flex";
  window.showForm("forgot");
};

/**
 * Handles user logout.
 */
window.logout = function () {
  window.saveUserToLocalStorage(null); // Clear current user
  window.updateAuthUI(); // Update UI
  window.showToast("Anda telah logout.", "info");
};

/**
 * Handles user login.
 */
window.login = function () {
  const username = loginUsernameInput.value || "";
  const password = loginPasswordInput.value || "";

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find(
    (u) =>
      (u.username === username ||
        u.email === username ||
        u.phone === username) &&
      u.password === password
  );

  if (foundUser) {
    window.saveUserToLocalStorage(foundUser);
    window.updateAuthUI();
    if (authModal) authModal.style.display = "none";
    window.showToast("Login berhasil!", "success");
    renderProducts(products); // Refresh products to show/hide add to cart buttons
  } else {
    if (loginError) loginError.textContent = "ID atau kata sandi salah.";
    window.showToast("Login gagal!", "error");
  }
};

/**
 * Handles user registration - now initiates OTP flow.
 */
window.register = function () {
  const username = regUsernameInput.value.trim();
  const name = regNameInput.value.trim();
  const email = regEmailInput.value.trim();
  const phone = regPhoneInput.value.trim();
  const password = regPasswordInput.value.trim();

  if (!username || !name || !email || !phone || !password) {
    if (registerError) registerError.textContent = "Semua field harus diisi.";
    window.showToast("Pendaftaran gagal!", "error");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((u) => u.username === username)) {
    registerError.textContent = "Username sudah digunakan.";
    return;
  }
  if (users.some((u) => u.email === email)) {
    registerError.textContent = "Email sudah digunakan.";
    return;
  }
  if (users.some((u) => u.phone === phone)) {
    registerError.textContent = "Nomor telepon sudah digunakan.";
    return;
  }

  registerError.textContent = "";

  // Simpan data sementara
  tempUserData = { username, name, email, phone, password, address: "" };
  otpPurpose = "register";
  currentOtpUserIdentifier = email;

  // Kirim OTP via backend (Django)
  sendOtp(email);
  // const otpSent = await sendOtp(email);
  // if (otpSent) {
  //     window.showToast('OTP telah dikirim. Mohon verifikasi.', 'info');
  //     window.showForm('otp'); // Tampilkan form OTP hanya jika sukses
  // } else {
  //     window.showToast('Gagal mengirim OTP.', 'error');
  // }
};

/**
 * Handles forgot password request - now initiates OTP flow.
 */
window.resetPassword = function () {
  const id = forgotIdInput.value.trim();
  if (!id) {
    if (forgotError)
      forgotError.textContent = "Masukkan Username / Email / No. Telepon Anda.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find(
    (u) => u.username === id || u.email === id || u.phone === id
  );

  if (foundUser) {
    tempUserData = foundUser; // Store the found user for later password update
    otpPurpose = "reset";
    currentOtpUserIdentifier = foundUser.email; // Simpan identifier untuk resend OTP
    sendOtp(foundUser.email); // Simulate sending OTP to user's registered email

    window.showToast(
      "Instruksi reset kata sandi telah dikirim. Mohon verifikasi.",
      "info"
    );
    window.showForm("otp"); // Show OTP verification form
    forgotIdInput.value = "";
  } else {
    if (forgotError) forgotError.textContent = "Akun tidak ditemukan.";
    window.showToast("Reset kata sandi gagal!", "error");
  }
};

/**
 * Simulates sending an OTP. In a real application, this would be an API call to your backend.
 * The backend would generate a secure OTP, send it via email/SMS, and store it for verification.
 * @param {string} destination - The email or phone number to send the OTP to.
 */

// function sendOtp(destination) {
//     // Clear previous OTP messages and errors before sending new one
//     if (otpMessage) otpMessage.textContent = '';
//     if (otpError) otpError.textContent = '';

//     // For simulation: Use a fixed 6-digit OTP for easy testing.
//     currentOtp = '123456'; // FIXED DUMMY OTP

//     // Display a message that OTP has been sent (even if dummy)
//     if (otpMessage) otpMessage.textContent = `OTP telah dikirim ke ${destination}. Silakan cek email Anda. (Dummy OTP: ${currentOtp})`;
//     window.showToast(`OTP baru telah dikirim ke ${destination}.`, 'success');
//     console.log(`Simulated OTP for ${destination}: ${currentOtp}`); // FOR TESTING ONLY! NEVER DO THIS IN PRODUCTION!
// }

async function checkLoginStatus() {
  try {
    const response = await fetch("/api/current_user/", {
      method: "GET",
      credentials: "include", // penting agar cookie session dikirim
    });
    const data = await response.json();

    if (data.is_authenticated) {
      document.getElementById("authButtons").style.display = "none";
      document.getElementById("accountMenu").style.display = "block";
      document.getElementById("accountUsername").textContent = data.username;
    } else {
      document.getElementById("authButtons").style.display = "flex";
      document.getElementById("accountMenu").style.display = "none";
    }
  } catch (error) {
    console.error("Error checking login status:", error);
  }
}

async function sendOtp(emailOrUsername) {
  currentOtpUserIdentifier = emailOrUsername; // ✅ store it globally before anything

  const response = await fetch("/api/send-otp/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_or_username: emailOrUsername }),
  });

  const result = await response.json();
  if (result.success) {
    window.showToast(result.message || "OTP berhasil dikirim.", "success");
    window.showForm("otp"); // ✅ Show OTP form here
  } else {
    window.showToast(result.message || "Gagal mengirim OTP.", "error");
  }
}

/**
 * Verifies the entered OTP.
 */
window.verifyOtp = async function () {
  const otpInput = document.getElementById("otp-input");
  const otpError = document.getElementById("otp-error");
  const identifierInput = document.getElementById("otp-identifier"); // input hidden or visible with email/username

  const enteredOtp = otpInput?.value.trim();
  const identifier = identifierInput?.value.trim();

  if (otpError) otpError.textContent = "";

  if (!enteredOtp) {
    otpError.textContent = "Mohon masukkan OTP.";
    return;
  }

  if (!identifier) {
    otpError.textContent = "Identitas pengguna tidak ditemukan.";
    return;
  }

  try {
    const response = await fetch("/verify-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(), // Required if CSRF is enforced
      },
      body: JSON.stringify({
        email_or_username: identifier,
        otp_code: enteredOtp,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      window.showToast(result.message, "success");
      window.location.href = "/login/"; // Redirect after successful verification
    } else {
      otpError.textContent = result.message || "OTP tidak valid.";
    }
  } catch (err) {
    otpError.textContent = "Terjadi kesalahan. Coba lagi.";
    console.error(err);
  }
};

// Fungsi mengambil CSRF token (hanya jika tidak pakai @csrf_exempt)
function getCsrfToken() {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return value;
  }
  return "";
}

//     otpError.textContent = ''; // Clear previous error

//     try {
//         const response = await fetch('/api/verify_otp/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 email_or_username: currentOtpUserIdentifier,
//                 otp_code: enteredOtp
//             })
//         });

//         const result = await response.json();

//         if (result.success) {
//             if (otpPurpose === 'register') {
//                 window.showToast('Pendaftaran berhasil! Silakan login.', 'success');
//                 window.showForm('login');

//                 // Clear registration form fields
//                 regUsernameInput.value = '';
//                 regNameInput.value = '';
//                 regEmailInput.value = '';
//                 regPhoneInput.value = '';
//                 regPasswordInput.value = '';
//             } else if (otpPurpose === 'reset') {
//                 window.showToast('OTP valid. Silakan lanjutkan reset password.', 'success');
//                 window.showForm('resetPassword'); // or wherever you want to send the user
//             }

//             // Clear OTP-related temporary data
//             tempUserData = null;
//             currentOtp = null;
//             otpPurpose = null;
//             currentOtpUserIdentifier = null;
//             otpInput.value = '';
//             if (authModal) authModal.style.display = 'none';
//         } else {
//             if (otpError) otpError.textContent = result.message || 'OTP salah.';
//             window.showToast(result.message || 'Verifikasi OTP gagal.', 'error');
//         }
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         if (otpError) otpError.textContent = 'Terjadi kesalahan saat memverifikasi OTP.';
//         window.showToast('Kesalahan sistem saat verifikasi.', 'error');
//     }
// };

/**
 * Handles resending the OTP.
 */
window.sendOtp = function () {
  if (!currentOtpUserIdentifier) {
    if (otpError)
      otpError.textContent =
        "Tidak ada tujuan OTP yang tersimpan. Silakan kembali ke form sebelumnya.";
    window.showToast(
      "Gagal mengirim ulang OTP. Data tujuan tidak ditemukan.",
      "error"
    );
    return;
  }
  sendOtp(currentOtpUserIdentifier);
};

// --- Product Catalog and Detail Functions ---

/**
 * Renders products into the catalog container.
 * @param {Array<object>} filteredProducts - Products to render.
 */
function renderProducts(filteredProducts) {
  if (!catalogContainer) return;

  catalogContainer.innerHTML = "";
  if (filteredProducts.length === 0) {
    catalogContainer.innerHTML =
      '<p style="text-align: center; color: #6c757d; font-size: 1.1em; padding: 50px;">Tidak ada produk yang ditemukan.</p>';
    return;
  }

  const currentUser = window.loadUserFromLocalStorage();

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const truncatedDescription =
      product.description.length > 70
        ? product.description.substring(0, 70) + "..."
        : product.description;

    // productCard.innerHTML = `
    //         <img src="${product.image}" alt="${product.name}" />
    //         <h4>${product.name}</h4>
    //         <p class="product-price">Rp ${product.price.toLocaleString(
    //           "id-ID"
    //         )}</p>
    //         <p>${truncatedDescription}</p>
    //         <button class="btn btn-primary add-to-cart-btn" data-id="${
    //           product.id
    //         }" ${
    //   currentUser ? "" : 'style="display: none;"' !! ini yang diganti !!
    // }>+ Keranjang</button>
    //     `;
    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h4>${product.name}</h4>
            <p class="product-price">Rp ${product.price.toLocaleString(
              "id-ID"
            )}</p>
            <p>${truncatedDescription}</p>
            <button class="btn btn-primary add-to-cart-btn" data-id="${
              product.id
            }" ${(style = "display: block;")}>+ Keranjang</button>
        `;
    catalogContainer.appendChild(productCard);

    const elementsToClickForDetail = productCard.querySelectorAll(
      "img, h4, p:not(.product-price), .product-badge"
    );
    elementsToClickForDetail.forEach((el) => {
      el.addEventListener("click", () => showProductDetail(product.id));
    });

    const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent product detail modal from opening
        // addToCartBtn(parseInt(e.target.dataset.id)); diganti
        addToCart(parseInt(e.target.dataset.id));
      });
    }
  });
}

// Helper function to show/hide forms
function showForm(formToShow) {
  console.log("tes");
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.style.display = "none";
  });
  formToShow.style.display = "block";
  // Clear previous messages
  loginError.textContent = "";
  registerError.textContent = "";
  forgotError.textContent = "";
  otpError.textContent = "";
  otpMessage.textContent = "";
}

/**
 * Shows the product detail modal.
 * @param {number} productId - The ID of the product to display.
 */
function showProductDetail(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product || !productDetailModal) return;

  modalProductImage.src = product.image;
  modalProductName.textContent = product.name;
  modalProductDescription.textContent = product.description;
  modalProductPrice.textContent = `Rp ${product.price.toLocaleString("id-ID")}`;
  modalProductStock.textContent =
    product.stock !== undefined ? product.stock : "N/A"; // Assuming stock can be undefined
  modalAddToCartBtn.dataset.productId = product.id; // Set ID for add to cart button

  const currentUser = window.loadUserFromLocalStorage();
  //   modalAddToCartBtn.style.display = currentUser ? "block" : "none"; // Show/hide button based on login diganti
  modalAddToCartBtn.style.display = "block"; // Show/hide button based on login

  productDetailModal.style.display = "flex"; // Use 'flex' for centering with CSS
}

// Close product detail modal
if (closeDetailModal) {
  closeDetailModal.addEventListener("click", () => {
    if (productDetailModal) productDetailModal.style.display = "none";
  });
}

// Add to cart from modal
if (modalAddToCartBtn) {
  modalAddToCartBtn.addEventListener("click", (event) => {
    const productId = parseInt(event.target.dataset.productId);
    addToCart(productId);
    if (productDetailModal) productDetailModal.style.display = "none"; // Close modal after adding
  });
}

// Initial form display (e.g., show login by default)
if (loginForm) showForm(loginForm); // Make sure to show a form when the page loads

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus(); // panggil ini di awal halaman
  // --- Login Logic ---
  const btnLoginSubmit = document.getElementById("btnLoginSubmit");
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener("click", async (e) => {
      e.preventDefault();
      // const usernameInput = document.getElementById('loginUsername');
      // const passwordInput = document.getElementById('loginPassword');

      const username = loginUsernameInput.value ? loginUsernameInput.value : "";
      const password = loginPasswordInput.value ? loginPasswordInput.value : "";

      try {
        const response = await fetch("/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // <--- penting
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          loginError.textContent = "";
          alert(data.message); // Or display a success message
          window.location.href = "/"; // Redirect to dashboard or home
        } else {
          loginError.textContent = data.message;
          if (data.message.includes("Account not activated")) {
            // If account not activated, show OTP form and pre-fill email/username
            otpMessage.textContent =
              "Account not active. Please verify your email with OTP.";
            document
              .getElementById("otpInput")
              .setAttribute("data-user-identifier", username); // Store username for OTP verification
            showForm(otpVerificationForm);
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        loginError.textContent = "An error occurred during login.";
      }
    });
  }

  const btnRegisterSubmit = document.getElementById("btnRegisterSubmit");
  // --- Registration Logic ---
  if (btnRegisterSubmit) {
    btnRegisterSubmit.addEventListener("click", async (e) => {
      e.preventDefault();
      const regUsernameInput = document.getElementById("regUsername");
      const regEmailInput = document.getElementById("regEmail");
      const regPasswordInput = document.getElementById("regPassword");
      const regNameInput = document.getElementById("regName");
      const regPhoneInput = document.getElementById("regPhone");

      const username = regUsernameInput?.value.trim();
      const email = regEmailInput?.value.trim();
      const password = regPasswordInput?.value;
      const phone = regPhoneInput?.value.trim();
      const name = regNameInput?.value.trim();

      try {
        console.log("Sending:", { username, email, password, phone, name });
        const response = await fetch("/api/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, phone, name }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          registerError.textContent = "";
          alert(data.message);
          otpMessage.textContent = data.message;
          document
            .getElementById("otpInput")
            .setAttribute("data-user-identifier", email);
          showForm("otp");
        } else {
          registerError.textContent = data.message;
        }
      } catch (error) {
        console.error("Registration error:", error);
        registerError.textContent = "An error occurred during registration.";
      }
    });
  }

  // --- Forgot Password / Send OTP Logic ---
  const btnResetPassword = document.getElementById("btnResetPassword");
  if (btnResetPassword) {
    btnResetPassword.addEventListener("click", async (e) => {
      e.preventDefault();
      const forgotIdInput = document.getElementById("forgotId");
      const emailOrUsername = forgotIdInput ? forgotIdInput.value : "";

      try {
        const response = await fetch("/api/send_otp/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'X-CSRFToken': getCookie('csrftoken'), // Add this in production
          },
          body: JSON.stringify({ email_or_username: emailOrUsername }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          forgotError.textContent = "";
          otpMessage.textContent = data.message;
          document
            .getElementById("otpInput")
            .setAttribute("data-user-identifier", emailOrUsername); // Store for verification
          showForm("otp");
        } else {
          forgotError.textContent = data.message;
        }
      } catch (error) {
        console.error("Send OTP error:", error);
        forgotError.textContent = "An error occurred while sending OTP.";
      }
    });
  }

  // --- OTP Verification Logic ---
  const btnVerifyOtp = document.getElementById("btnVerifyOtp");
  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener("click", async (e) => {
      e.preventDefault();
      const otpInput = document.getElementById("otpInput");
      const otpCode = otpInput ? otpInput.value.trim() : "";
      const userIdentifier = currentOtpUserIdentifier; // ✅ Gunakan variabel global

      if (!otpCode || !userIdentifier) {
        otpError.textContent = "OTP dan identitas pengguna diperlukan.";
        return;
      }

      try {
        const response = await fetch("/api/verify_otp/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_or_username: userIdentifier,
            otp_code: otpCode,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          otpError.textContent = "";
          alert(data.message);
          showForm("login"); // ✅ Ganti ke 'login' string, sesuai showForm yang kamu punya
        } else {
          otpError.textContent = data.message || "Verifikasi gagal.";
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        otpError.textContent = "Terjadi kesalahan saat memverifikasi OTP.";
      }
    });
  }
});

async function checkLoginStatus() {
  try {
    const response = await fetch("/api/get_current_user/", {
      method: "GET",
      credentials: "include", // <-- penting agar kirim cookie
    });
    const data = await response.json();

    if (data.is_authenticated) {
      // Tampilkan menu akun
      document.getElementById("authButtons").style.display = "none";
      document.getElementById("accountMenu").style.display = "block";
      document.getElementById("accountUsername").textContent = data.username;
    } else {
      // Tampilkan tombol login
      document.getElementById("authButtons").style.display = "block";
      document.getElementById("accountMenu").style.display = "none";
    }
  } catch (error) {
    console.error("Failed to check login status", error);
  }
}
// CSRF token retrieval for production (add this function)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// ... (rest of your existing dashboard.js functions) ...
// --- Cart Management Functions (Globalized for use across pages) ---

/**
 * Adds a product to the user's cart.
 * @param {number} productId - The ID of the product to add.
 */
window.addToCart = function (productId) {
  const currentUser = window.loadUserFromLocalStorage();
  if (!currentUser) {
    window.showToast(
      "Silakan login untuk menambahkan produk ke keranjang.",
      "error"
    );
    window.showLoginModal();
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    window.showToast("Produk tidak ditemukan.", "error");
    return;
  }

  const cartKey = `cart_${currentUser.username}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingCartItem = cart.find((item) => item.id === productId);

  // Assuming a 'stock' property in your products array for this logic
  const productStock = product.stock !== undefined ? product.stock : 1000; // Default large stock if not specified

  if (existingCartItem) {
    if (existingCartItem.quantity < productStock) {
      existingCartItem.quantity++;
      window.showToast(`Menambahkan ${product.name} ke keranjang.`, "success");
    } else {
      window.showToast(`Stok ${product.name} terbatas.`, "error");
    }
  } else {
    if (productStock > 0) {
      cart.push({ ...product, quantity: 1 });
      window.showToast(`${product.name} ditambahkan ke keranjang.`, "success");
    } else {
      window.showToast(`${product.name} sedang tidak tersedia.`, "error");
    }
  }
  localStorage.setItem(cartKey, JSON.stringify(cart));
  // Optionally, update a cart count icon in the header if you have one
};

// --- Event Listeners and Initializations ---

document.addEventListener("DOMContentLoaded", function () {
  // Initial load of user data and update UI
  window.updateAuthUI();

  // Event listeners for auth buttons in header
  const btnLoginHeader = document.getElementById("btnLogin");
  const btnRegisterHeader = document.getElementById("btnRegister");
  if (btnLoginHeader)
    btnLoginHeader.addEventListener("click", window.showLoginModal);
  if (btnRegisterHeader)
    btnRegisterHeader.addEventListener("click", window.showRegisterModal);

  // Event listeners for form switching
  if (showRegisterFromLogin)
    showRegisterFromLogin.addEventListener("click", () =>
      showForm(registerForm)
    );
  if (showLoginFromRegister)
    showLoginFromRegister.addEventListener("click", () => showForm(loginForm));
  if (showForgotFromLogin)
    showForgotFromLogin.addEventListener("click", () =>
      showForm(forgotPasswordForm)
    );
  if (showLoginFromForgot)
    showLoginFromForgot.addEventListener("click", () => showForm(loginForm));
  if (showLoginFromOtp)
    showLoginFromOtp.addEventListener("click", () => showForm(loginForm));

  // Event listener for account menu dropdown
  if (accountMenu && accountDropdown) {
    accountMenu.addEventListener("click", function (e) {
      accountDropdown.style.display =
        accountDropdown.style.display === "block" ? "none" : "block";
      e.stopPropagation(); // Prevent document click from closing it immediately
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", function (e) {
      if (
        !accountMenu.contains(e.target) &&
        accountDropdown.style.display === "block"
      ) {
        accountDropdown.style.display = "none";
      }
    });
  }

  // Logout button
  // if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
  if (logoutBtn) logoutBtn.addEventListener("click", window.logout);
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      await fetch("/logout/", { method: "GET", credentials: "include" });
      window.location.reload(); // reload page untuk update UI
    } catch (error) {
      console.error("Logout error:", error);
    }
  });

  // Close auth modal
  if (closeAuthModal) {
    closeAuthModal.addEventListener("click", () => {
      if (authModal) authModal.style.display = "none";
      // Clear temporary OTP data when modal is closed manually
      tempUserData = null;
      currentOtp = null;
      otpPurpose = null;
      currentOtpUserIdentifier = null;
      otpInput.value = "";
      if (otpMessage) otpMessage.textContent = "";
      if (otpError) otpError.textContent = "";
    });
  }

  // Auth form elements (assuming these IDs exist in dashboard.html)
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const otpVerificationForm = document.getElementById("otpVerificationForm");

  // Auth form navigation
  if (showRegisterLink)
    showRegisterLink.addEventListener("click", () =>
      window.showForm("register")
    );
  if (showLoginFromRegisterLink)
    showLoginFromRegisterLink.addEventListener("click", () =>
      window.showForm("login")
    );
  if (showForgotPasswordLink)
    showForgotPasswordLink.addEventListener("click", () =>
      window.showForm("forgot")
    );
  if (showLoginFromForgotLink)
    showLoginFromForgotLink.addEventListener("click", () =>
      window.showForm("login")
    );
  if (showLoginFromOtpLink)
    showLoginFromOtpLink.addEventListener("click", () =>
      window.showForm("login")
    );

  // Auth form submissions
  if (btnLoginSubmit) btnLoginSubmit.addEventListener("click", window.login);
  if (btnRegisterSubmit)
    btnRegisterSubmit.addEventListener("click", window.register);
  if (btnResetPassword)
    btnResetPassword.addEventListener("click", window.resetPassword);
  if (btnVerifyOtp) btnVerifyOtp.addEventListener("click", window.verifyOtp);
  if (btnResendOtp) btnResendOtp.addEventListener("click", window.sendOtp);

  // --- Dashboard Specific Logic ---

  // Populate categories in the filter dropdown
  if (categoryFilter) {
    const categories = [...new Set(products.map((p) => p.category))];
    categoryFilter.innerHTML = '<option value="all">Semua Kategori</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    // Filter products when category changes
    categoryFilter.addEventListener("change", () => filterAndSearchProducts());
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", () => filterAndSearchProducts());
  }

  // Combined filter and search function
  function filterAndSearchProducts() {
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }
    renderProducts(filtered);
  }

  // Initial product rendering on dashboard load
  renderProducts(products);
});
