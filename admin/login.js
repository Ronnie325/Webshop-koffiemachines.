import { authAPI, setToken } from '../src/modules/api.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('login-btn');

// Check if already logged in
const token = localStorage.getItem('admin_token');
if (token) {
    // Verify token is still valid
    authAPI.verify(token)
        .then(() => {
            window.location.href = '/admin/index.html';
        })
        .catch(() => {
            // Token invalid, clear it
            localStorage.removeItem('admin_token');
        });
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.textContent = 'Inloggen...';
    errorMessage.style.display = 'none';

    try {
        const response = await authAPI.login(username, password);

        // Save token
        setToken(response.token);

        // Show success message
        errorMessage.style.display = 'block';
        errorMessage.className = 'success-message';
        errorMessage.textContent = 'Inloggen gelukt! Doorsturen...';

        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = '/admin/index.html';
        }, 500);

    } catch (error) {
        console.error('Login error:', error);

        errorMessage.style.display = 'block';
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Ongeldige inloggegevens. Probeer opnieuw.';

        loginBtn.disabled = false;
        loginBtn.textContent = 'Inloggen';
    }
});
