// profile.js - This file contains profile-specific logic and relies on dashboard.js for global functions

document.addEventListener('DOMContentLoaded', () => {
    const profileUsernameInput = document.getElementById('profileUsername');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileAddressInput = document.getElementById('profileAddress');
    const profileForm = document.getElementById('profileForm');

    /**
     * Loads user data into the profile form.
     */
    function loadProfileData() {
        const currentUser = window.loadUserFromLocalStorage();
        if (currentUser) {
            profileUsernameInput.value = currentUser.username || '';
            profileNameInput.value = currentUser.name || '';
            profileEmailInput.value = currentUser.email || '';
            profilePhoneInput.value = currentUser.phone || '';
            profileAddressInput.value = currentUser.address || '';
        } else {
            window.showToast('Anda belum login. Silakan login.', 'error');
            // Optionally redirect to dashboard or login page
            // window.location.href = '/'; // Ini sudah benar mengarah ke root
        }
    }

    // Handle profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let currentUser = window.loadUserFromLocalStorage();
            if (currentUser) {
                // Update currentUser object with new form values
                currentUser.name = profileNameInput.value.trim();
                currentUser.email = profileEmailInput.value.trim();
                currentUser.phone = profilePhoneInput.value.trim();
                currentUser.address = profileAddressInput.value.trim();

                // Update in the 'users' array in localStorage
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.username === currentUser.username);
                if (userIndex > -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                    // Also update the activeUser in localStorage if anything in currentUser changed
                    // (though for profile, username typically doesn't change, but it's good practice)
                    localStorage.setItem('activeUser', currentUser.username); // Re-set active user if username changed
                    window.showToast('Profil berhasil diperbarui!', 'success');
                    window.updateAuthUI(); // Update UI in case name changed
                } else {
                    window.showToast('Gagal menemukan profil pengguna untuk diperbarui.', 'error');
                }
            } else {
                window.showToast('Anda harus login untuk memperbarui profil.', 'error');
            }
        });
    }

    // --- Inisialisasi untuk halaman profil ---
    loadProfileData(); // Muat data profil saat halaman dimuat

    // Initial load of user data and update UI for header (delegated to dashboard.js functions)
    window.updateAuthUI();

    // Event listeners for header auth buttons (Copied from dashboard.js for header on all pages)
    document.getElementById('btnLogin')?.addEventListener('click', window.showLoginModal);
    document.getElementById('btnRegister')?.addEventListener('click', window.showRegisterModal);

    // Event listener for account menu dropdown
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

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', window.logout);

    // Close auth modal
    document.getElementById('closeAuthModal')?.addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'none';
    });

    // Auth form navigation links
    document.getElementById('showRegister')?.addEventListener('click', () => window.showForm('register'));
    document.getElementById('showLoginFromRegister')?.addEventListener('click', () => window.showForm('login'));
    document.getElementById('showForgotPassword')?.addEventListener('click', () => window.showForm('forgot'));
    document.getElementById('showLoginFromForgot')?.addEventListener('click', () => window.showForm('login'));

    // Auth form submissions
    document.getElementById('btnLoginSubmit')?.addEventListener('click', window.login);
    document.getElementById('btnRegisterSubmit')?.addEventListener('click', window.register);
    document.getElementById('btnResetPassword')?.addEventListener('click', window.resetPassword);

    // Search functionality in header (re-enable for other pages if needed)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                // Redirect to dashboard (root URL) with search term
                window.location.href = `/?search=${encodeURIComponent(searchInput.value.trim())}`; // <-- BARIS YANG DIPERBAIKI!
            }
        });
    }
});