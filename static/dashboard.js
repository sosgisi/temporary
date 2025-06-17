// dashboard.js - This file will contain global functions and dashboard specific logic
console.log("dashboard.js loaded");
// Global variables (mock data for products and users)
let products = [];

// Auth related DOM elements
const authButtons = document.getElementById('authButtons');
const accountMenu = document.getElementById('accountMenu');
const accountUsername = document.getElementById('accountUsername');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginFromRegisterLink = document.getElementById('showLoginFromRegister');
const showForgotPasswordLink = document.getElementById('showForgotPassword');
const showLoginFromForgotLink = document.getElementById('showLoginFromForgot');
// const btnLoginSubmit = document.getElementById('btnLoginSubmit');
// const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
// const btnResetPassword = document.getElementById('btnResetPassword');
const loginUsernameInput = document.getElementById('loginUsername');
const loginPasswordInput = document.getElementById('loginPassword');
const regUsernameInput = document.getElementById('regUsername');
const regNameInput = document.getElementById('regName');
const regEmailInput = document.getElementById('regEmail');
const regPhoneInput = document.getElementById('regPhone');
const regPasswordInput = document.getElementById('regPassword');
const forgotIdInput = document.getElementById('forgotId');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const forgotError = document.getElementById('forgotError');
const toast = document.getElementById('toast');

// Buttons to switch forms
const showRegisterFromLogin = document.getElementById('showRegisterFromLogin');
const showLoginFromRegister = document.getElementById('showLoginFromRegister');
const showForgotFromLogin = document.getElementById('showForgotFromLogin');
const showLoginFromForgot = document.getElementById('showLoginFromForgot');
const showVerifyOtpFromLogin = document.getElementById('showVerifyOtpFromLogin'); // Added this if you want a direct link to OTP form
const showLoginFromOtp = document.getElementById('showLoginFromOtp');

// New OTP related DOM elements
const otpVerificationForm = document.getElementById('otpVerificationForm');
const otpInput = document.getElementById('otpInput');
const otpMessage = document.getElementById('otpMessage');
const otpError = document.getElementById('otpError');
let btnVerifyOtp = document.getElementById('btnVerifyOtp');
const btnResendOtp = document.getElementById('btnResendOtp');
const showLoginFromOtpLink = document.getElementById('showLoginFromOtp');

// Temporary storage for user registration/reset data during OTP flow
let tempUserData = null;
let currentOtp = null; // This will now be set to a fixed value for simulation
let otpPurpose = null; // 'register' or 'reset'
let currentOtpUserIdentifier = null; // Menyimpan email/phone tujuan OTP

// Product Detail Modal DOM elements
const productDetailModal = document.getElementById('productDetailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductDescription = document.getElementById('modalProductDescription');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalProductStock = document.getElementById('modalProductStock');
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

// Dashboard specific DOM elements
const catalogContainer = document.getElementById('catalog');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const accountDropdown = document.getElementById('accountDropdown');

// --- Global Utility Functions ---

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - 'success', 'error', or 'info'.
 */
window.showToast = function(message, type = 'info') {
    if (!toast) return; // Ensure toast element exists
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
};

/**
 * Loads the current user from Local Storage.
 * @returns {object|null} The current user object or null if not logged in.
 */
async function getCurrentUser() {
    const response = await fetch('/api/get_current_user/', {
        credentials: 'include' // ⬅️ penting agar session cookie dikirim
    });
    if (response.ok) {
        const data = await response.json();
        if (data.is_authenticated) {
            console.log('Logged in as:', data.username);
            return data.username;
        } else {
            console.log('User not authenticated');
        }
    } else {
        console.error('Failed to fetch user');
    }
    return null;
}

/**
 * Updates the authentication UI based on current user status.
 */
window.updateAuthUI = async function() {
    const currentUser = await await getCurrentUser();
    console.log(currentUser)
    if (authButtons && accountMenu && accountUsername) {
        if (currentUser) {
            authButtons.style.display = 'none';
            accountMenu.style.display = 'flex';
            accountUsername.textContent = currentUser; // Or currentUser.name
            updateAddToCartButtonsVisibility(true); // Show add to cart buttons
        } else {
            authButtons.style.display = 'flex';
            accountMenu.style.display = 'none';
            accountUsername.textContent = '';
            updateAddToCartButtonsVisibility(false); // Hide add to cart buttons
        }
    }
};

function updateAddToCartButtonsVisibility(isLoggedIn) {
    console.log(isLoggedIn)
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.style.display = isLoggedIn ? 'block' : 'none';
    });
    if (modalAddToCartBtn) {
        modalAddToCartBtn.style.display = isLoggedIn ? 'block' : 'none';
    }
}

/**
 * Shows a specific authentication form (login, register, forgot password, otp verification) in the modal.
 * @param {string} formName - 'login', 'register', 'forgot', or 'otp'.
 */
window.showForm = function(formName) {
    console.log(formName)
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
    if (otpVerificationForm) otpVerificationForm.style.display = 'none';
    
    // Clear all error/info messages
    if (loginError) loginError.textContent = '';
    if (registerError) registerError.textContent = '';
    if (forgotError) forgotError.textContent = '';
    if (otpMessage) otpMessage.textContent = '';
    if (otpError) otpError.textContent = '';

    if (formName === 'login' && loginForm) {
        loginForm.style.display = 'block';
    } else if (formName === 'register' && registerForm) {
        registerForm.style.display = 'block';
    } else if (formName === 'forgot' && forgotPasswordForm) {
        forgotPasswordForm.style.display = 'block';
    } else if (formName === 'otp' && otpVerificationForm) {
        otpVerificationForm.style.display = 'block';
    }
};

/**
 * Shows the login modal.
 */
window.showLoginModal = function() {
    if (authModal) authModal.style.display = 'flex';
    window.showForm('login');
};

/**
 * Shows the register modal.
 */
window.showRegisterModal = function() {
    if (authModal) authModal.style.display = 'flex';
    window.showForm('register');
};

/**
 * Shows the forgot password modal.
 */
window.showForgotPasswordModal = function() {
    if (authModal) authModal.style.display = 'flex';
    window.showForm('forgot');
};

/**
 * Handles user logout.
 */
window.logout = async function () {
    try {
        const response = await fetch('/api/logout/', {
            method: 'POST',
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.updateAuthUI();
            renderProducts(products);
            window.showToast('Berhasil logout!', 'success');
        } else {
            window.showToast(data.message || 'Gagal logout', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        window.showToast('Terjadi kesalahan saat logout.', 'error');
    }
};


window.fetchUsersFromAPI = async function () {
    try {
        const response = await fetch('/api/users/', {
            method: 'GET',
            credentials: 'include', // ⬅️ penting!
        });

        if (!response.ok) throw new Error('Gagal mengambil data user');

        const users = await response.json();
        console.log('Fetched users:', users);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


/**
 * Simulates sending an OTP. In a real application, this would be an API call to your backend.
 * The backend would generate a secure OTP, send it via email/SMS, and store it for verification.
 * @param {string} destination - The email or phone number to send the OTP to.
 */

async function checkLoginStatus() {
    try {
        const response = await fetch('/api/current_user/', {
            method: 'GET',
            credentials: 'include'  // penting agar cookie session dikirim
        });
        const data = await response.json();

        if (data.is_authenticated) {
            document.getElementById('authButtons').style.display = 'none';
            document.getElementById('accountMenu').style.display = 'block';
            document.getElementById('accountUsername').textContent = data.username;
        } else {
            document.getElementById('authButtons').style.display = 'flex';
            document.getElementById('accountMenu').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

async function sendOtp(emailOrUsername) {
  try {
    currentOtpUserIdentifier = emailOrUsername;

    const response = await fetch('/api/send-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_or_username: emailOrUsername })
    });

    const result = await response.json();
    if (result.success) {
      window.showToast(result.message || 'OTP berhasil dikirim.', 'success');
      window.showForm('otp');
    } else {
      window.showToast(result.message || 'Gagal mengirim OTP.', 'error');
    }
  } catch (error) {
    console.error("Error saat mengirim OTP:", error);
    window.showToast('Terjadi kesalahan server.', 'error');
  }
}


// Fungsi mengambil CSRF token (hanya jika tidak pakai @csrf_exempt)
// function getCsrfToken() {
//     const name = 'csrftoken';
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//         const [key, value] = cookie.trim().split('=');
//         if (key === name) return value;
//     }
//     return '';
// }


/**
 * Handles resending the OTP.
 */
window.sendOtp = function() {
    if (!currentOtpUserIdentifier) {
        if (otpError) otpError.textContent = 'Tidak ada tujuan OTP yang tersimpan. Silakan kembali ke form sebelumnya.';
        window.showToast('Gagal mengirim ulang OTP. Data tujuan tidak ditemukan.', 'error');
        return;
    }
    sendOtp(currentOtpUserIdentifier);
};


// --- Product Catalog and Detail Functions ---

/**
 * Renders products into the catalog container.
 * @param {Array<object>} filteredProducts - Products to render.
 */
function renderProducts(productsToRender) {
  const catalog = document.getElementById("catalog");
  if (!catalog) {
        console.warn('Elemen dengan ID "catalog" tidak ditemukan di halaman.');
        return;
    }
  catalog.innerHTML = "";

  productsToRender.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p class="product-price">Rp${product.price.toLocaleString("id-ID")}</p>
      <p class="product-category">${product.category}</p>
      <button onclick="showProductDetail(${product.id})" class="btn btn-primary mt-2">Detail</button>
    `;

    catalog.appendChild(card);
  });
}

renderProducts(products);

// Helper function to show/hide forms
    function showForm(formToShow) {
        console.log('tes')
        document.querySelectorAll('.auth-form').forEach(form => {
            form.style.display = 'none';
        });
        formToShow.style.display = 'block';
        // Clear previous messages
        loginError.textContent = '';
        registerError.textContent = '';
        forgotError.textContent = '';
        otpError.textContent = '';
        otpMessage.textContent = '';
    }

/**
 * Shows the product detail modal.
 * @param {number} productId - The ID of the product to display.
 */
async function showProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || !productDetailModal) return;

  // Optional: defensive check
  if (!modalProductImage || !modalProductName || !modalProductDescription || !modalProductPrice || !modalProductStock || !modalAddToCartBtn) return;

  modalProductImage.src = product.image || '/static/default-product.png';
  modalProductName.textContent = product.name;
  modalProductDescription.textContent = product.description || 'Tidak ada deskripsi.';
  modalProductPrice.textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
  modalProductStock.textContent = `${product.stock ?? 'N/A'} item tersedia`;

  modalAddToCartBtn.dataset.productId = product.id;
  modalAddToCartBtn.onclick = () => addToCart(product.id);

  const currentUser = await getCurrentUser();
  modalAddToCartBtn.style.display = currentUser ? 'block' : 'none';

  productDetailModal.style.display = 'flex';
}

// Close product detail modal
if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
        if (productDetailModal) productDetailModal.style.display = 'none';
    });
}

// Add to cart from modal
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', (event) => {
        const productId = parseInt(event.target.dataset.productId);
        addToCart(productId);
        if (productDetailModal) productDetailModal.style.display = 'none'; // Close modal after adding
    });
}

 // Initial form display (e.g., show login by default)
    if (loginForm) showForm(loginForm); // Make sure to show a form when the page loads

function updateCartCountUI() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartLink = document.querySelector("a[href$='cart']");
  if (cartLink) {
    let badge = cartLink.querySelector(".cart-count-badge");

    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count-badge";
      badge.style.cssText = `
        position: absolute;
        top: -6px;
        right: -6px;
        background-color: red;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 50%;
      `;
      cartLink.style.position = 'relative';
      cartLink.appendChild(badge);
    }

    badge.textContent = totalQty > 0 ? totalQty : '';
  }
}

async function fetchProducts() {
    await fetch("http://127.0.0.1:8000/api/products/")
    .then(response => {
        if (!response.ok) throw new Error("Gagal mengambil produk");
        return response.json();
    })
    .then(data => {
        console.log(data)
        products = data;
        renderProducts(products);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Gagal memuat produk.");
    });

    // Combined filter and search function
    function filterAndSearchProducts() {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        let filtered = products;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                (product.category || 'Tidak ada kategori').toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(product => {
                const name = (product.name || '').toLowerCase();
                const desc = (product.description || '').toLowerCase();
                const cat = (product.category || '').toLowerCase();

                return name.includes(searchTerm) || desc.includes(searchTerm) || cat.includes(searchTerm);
            });
        }

        renderProducts(filtered);
    }
    
    // Populate categories in the filter dropdown
    if (categoryFilter) {
        console.log(products)
        const categories = [...new Set(products.map(p => (p.category || 'Tidak ada kategori')))];
        
        categoryFilter.innerHTML = '<option value="all">Semua Kategori</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        categoryFilter.addEventListener('change', () => filterAndSearchProducts());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus(); // panggil ini di awal halaman
    window.fetchUsersFromAPI();
    updateCartCountUI();
    fetchProducts()

    // --- Login Logic ---
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', async (e) => {
            e.preventDefault();

            const username = loginUsernameInput.value ? loginUsernameInput.value : '';
            const password = loginPasswordInput.value ? loginPasswordInput.value : '';

            try {
                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // <--- penting
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    loginError.textContent = '';
                    alert(data.message); // Or display a success message
                    window.location.href = '/'; // Redirect to dashboard or home
                } else {
                    loginError.textContent = data.message;
                    if (data.message.includes('Account not activated')) {
                        // If account not activated, show OTP form and pre-fill email/username
                        otpMessage.textContent = 'Account not active. Please verify your email with OTP.';
                        document.getElementById('otpInput').setAttribute('data-user-identifier', username); // Store username for OTP verification
                        showForm(otpVerificationForm);
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                loginError.textContent = 'An error occurred during login.';
            }
        });
    }

    const btnRegisterSubmit = document.getElementById('btnRegisterSubmit');
     // --- Registration Logic ---
    if (btnRegisterSubmit) {
        btnRegisterSubmit.addEventListener('click', async (e) => {
            e.preventDefault();

            const username = regUsernameInput?.value.trim();
            const email = regEmailInput?.value.trim();
            const password = regPasswordInput?.value;
            const phone = regPhoneInput?.value.trim();
            const name = regNameInput?.value.trim();

            try {
                console.log('Sending:', { username, email, password, phone, name });
                const response = await fetch('/api/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password, phone, name })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    registerError.textContent = '';
                    alert(data.message);
                    otpMessage.textContent = data.message;
                    document.getElementById('otpInput').setAttribute('data-user-identifier', email);
                    showForm('otp');
                } else {
                    registerError.textContent = data.message;
                }
            } catch (error) {
                console.error('Registration error:', error);
                registerError.textContent = 'An error occurred during registration.';
            }
        });
    }

     // --- Forgot Password / Send OTP Logic ---
    const btnResetPassword = document.getElementById('btnResetPassword');
    if (btnResetPassword) {
        btnResetPassword.addEventListener('click', async (e) => {
            e.preventDefault();
            const forgotIdInput = document.getElementById('forgotId');
            const emailOrUsername = forgotIdInput ? forgotIdInput.value : '';

            try {
                const response = await fetch('/api/send_otp/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'X-CSRFToken': getCookie('csrftoken'), // Add this in production
                    },
                    body: JSON.stringify({ email_or_username: emailOrUsername })
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    forgotError.textContent = '';
                    otpMessage.textContent = data.message;
                    document.getElementById('otpInput').setAttribute('data-user-identifier', emailOrUsername); // Store for verification
                    showForm('otp');
                } else {
                    forgotError.textContent = data.message;
                }
            } catch (error) {
                console.error('Send OTP error:', error);
                forgotError.textContent = 'An error occurred while sending OTP.';
            }
        });
    }

    // --- OTP Verification Logic ---
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');
    if (btnVerifyOtp) {
        btnVerifyOtp.addEventListener('click', async (e) => {
            e.preventDefault();
            const otpInput = document.getElementById('otpInput');
            const otpCode = otpInput ? otpInput.value.trim() : '';
            const userIdentifier = currentOtpUserIdentifier; // ✅ Gunakan variabel global

            if (!otpCode || !userIdentifier) {
                otpError.textContent = 'OTP dan identitas pengguna diperlukan.';
                return;
            }

            try {
                const response = await fetch('/api/verify_otp/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email_or_username: userIdentifier,
                        otp_code: otpCode
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    otpError.textContent = '';
                    alert(data.message);
                    showForm('login'); // ✅ Ganti ke 'login' string, sesuai showForm yang kamu punya
                } else {
                    otpError.textContent = data.message || 'Verifikasi gagal.';
                }
            } catch (error) {
                console.error('OTP verification error:', error);
                otpError.textContent = 'Terjadi kesalahan saat memverifikasi OTP.';
            }
        });
    }

});

    async function checkLoginStatus() {
        try {
            const response = await fetch('/api/get_current_user/', {
                method: 'GET',
                credentials: 'include'  // <-- penting agar kirim cookie
            });
            const data = await response.json();

            if (data.is_authenticated) {
                // Tampilkan menu akun
                document.getElementById('authButtons').style.display = 'none';
                document.getElementById('accountMenu').style.display = 'block';
                document.getElementById('accountUsername').textContent = data.username;
            } else {
                // Tampilkan tombol login
                document.getElementById('authButtons').style.display = 'block';
                document.getElementById('accountMenu').style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to check login status', error);
        }
    }
    // CSRF token retrieval for production (add this function)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
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
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateCartCountUI(); // Pastikan ini ada!
  showToast(`${product.name} berhasil ditambahkan ke keranjang.`);
}

function updateCartCountUI() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartIcon = document.querySelector(".header-icons a[href$='cart']"); // pastikan selector sesuai
  if (cartIcon) {
    let badge = cartIcon.querySelector(".cart-count-badge");

    if (!badge) {
      badge = document.createElement("span");
      badge.classList.add("cart-count-badge");
      cartIcon.appendChild(badge);
    }

    badge.textContent = cartCount > 0 ? cartCount : "";
  }
}

function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return '';
}


// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', function() {
    // Initial load of user data and update UI
    window.updateAuthUI();

    // Event listeners for auth buttons in header
    const btnLoginHeader = document.getElementById('btnLogin');
    const btnRegisterHeader = document.getElementById('btnRegister');
    if (btnLoginHeader) btnLoginHeader.addEventListener('click', window.showLoginModal);
    if (btnRegisterHeader) btnRegisterHeader.addEventListener('click', window.showRegisterModal);

 // Event listeners for form switching
    if (showRegisterFromLogin) showRegisterFromLogin.addEventListener('click', () => showForm(registerForm));
    if (showLoginFromRegister) showLoginFromRegister.addEventListener('click', () => showForm(loginForm));
    if (showForgotFromLogin) showForgotFromLogin.addEventListener('click', () => showForm(forgotPasswordForm));
    if (showLoginFromForgot) showLoginFromForgot.addEventListener('click', () => showForm(loginForm));
    if (showLoginFromOtp) showLoginFromOtp.addEventListener('click', () => showForm(loginForm));

    // Event listener for account menu dropdown
    if (accountMenu && accountDropdown) {
        accountMenu.addEventListener('click', function(e) {
            accountDropdown.style.display = accountDropdown.style.display === 'block' ? 'none' : 'block';
            e.stopPropagation(); // Prevent document click from closing it immediately
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', function(e) {
            if (!accountMenu.contains(e.target) && accountDropdown.style.display === 'block') {
                accountDropdown.style.display = 'none';
            }
        });
    }

    // Logout button
    // if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
    if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
        document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('/logout/', { method: 'GET', credentials: 'include' });
            window.location.reload(); // reload page untuk update UI
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // Close auth modal
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            if (authModal) authModal.style.display = 'none';
            // Clear temporary OTP data when modal is closed manually
            tempUserData = null;
            currentOtp = null;
            otpPurpose = null;
            currentOtpUserIdentifier = null;
            otpInput.value = '';
            if (otpMessage) otpMessage.textContent = '';
            if (otpError) otpError.textContent = '';
        });
    }

    // Auth form elements (assuming these IDs exist in dashboard.html)
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const otpVerificationForm = document.getElementById('otpVerificationForm');

    // Auth form navigation
    if (showRegisterLink) showRegisterLink.addEventListener('click', () => window.showForm('register'));
    if (showLoginFromRegisterLink) showLoginFromRegisterLink.addEventListener('click', () => window.showForm('login'));
    if (showForgotPasswordLink) showForgotPasswordLink.addEventListener('click', () => window.showForm('forgot'));
    if (showLoginFromForgotLink) showLoginFromForgotLink.addEventListener('click', () => window.showForm('login'));
    if (showLoginFromOtpLink) showLoginFromOtpLink.addEventListener('click', () => window.showForm('login'));

    // Auth form submissions
    if (btnLoginSubmit) btnLoginSubmit.addEventListener('click', window.login);
    if (btnRegisterSubmit) btnRegisterSubmit.addEventListener('click', window.register);
    if (btnResetPassword) btnResetPassword.addEventListener('click', window.resetPassword);
    if (btnVerifyOtp) btnVerifyOtp.addEventListener('click', window.verifyOtp);
    if (btnResendOtp) btnResendOtp.addEventListener('click', window.sendOtp);

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', () => filterAndSearchProducts());
    }

    // Initial product rendering on dashboard load
    renderProducts(products);
});
