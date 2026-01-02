import { getToken, clearToken, productsAPI, ordersAPI } from '../src/modules/api.js';

// Check authentication
const token = getToken();
if (!token) {
    window.location.href = '/admin/login.html';
}

// Load dashboard data
async function loadDashboard() {
    try {
        // Load products
        const products = await productsAPI.getAll();
        document.getElementById('total-products').textContent = products.length;

        // Load orders
        const orders = await ordersAPI.getAll();
        document.getElementById('total-orders').textContent = orders.length;

        // Calculate revenue
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('total-revenue').textContent = '€' + totalRevenue.toLocaleString('nl-NL');

        // Display recent orders
        displayOrders(orders.slice(0, 10));

    } catch (error) {
        console.error('Error loading dashboard:', error);
        if (error.message === 'Authentication required') {
            window.location.href = '/admin/login.html';
        }
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-tbody');

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    Geen bestellingen gevonden
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer.name}</td>
            <td>${order.items.length} item(s)</td>
            <td><strong>€${order.total.toLocaleString('nl-NL')}</strong></td>
            <td>
                <span class="badge badge-${getStatusClass(order.status)}">
                    ${getStatusLabel(order.status)}
                </span>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString('nl-NL')}</td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const classes = {
        pending: 'warning',
        processing: 'info',
        shipped: 'info',
        delivered: 'success',
        cancelled: 'danger'
    };
    return classes[status] || 'info';
}

function getStatusLabel(status) {
    const labels = {
        pending: 'In behandeling',
        processing: 'Wordt verwerkt',
        shipped: 'Verzonden',
        delivered: 'Afgeleverd',
        cancelled: 'Geannuleerd'
    };
    return labels[status] || status;
}

// Logout
document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = '/admin/login.html';
});

// Initialize
loadDashboard();

// Welcome message
const welcomeText = document.getElementById('welcome-text');
const hour = new Date().getHours();
let greeting = 'Goedemorgen';
if (hour >= 12 && hour < 18) greeting = 'Goedemiddag';
else if (hour >= 18) greeting = 'Goedenavond';
welcomeText.textContent = `${greeting}, Admin`;
