import { getToken, clearToken, ordersAPI } from '../src/modules/api.js';

const token = getToken();
if (!token) window.location.href = '/admin/login.html';

async function loadOrders() {
    try {
        const orders = await ordersAPI.getAll();
        displayOrders(orders);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-tbody');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">Geen bestellingen gevonden</td></tr>';
        return;
    }
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>
                <div>${order.customer.name}</div>
                <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${order.customer.email}</div>
            </td>
            <td>${order.items.length} item(s)</td>
            <td><strong>€${order.total.toLocaleString('nl-NL')}</strong></td>
            <td><span class="badge badge-${getStatusClass(order.status)}">${getStatusLabel(order.status)}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td>
                <select onchange="window.updateOrderStatus('${order.id}', this.value)" style="padding: 4px 8px; border-radius: 4px; border: 1px solid var(--color-border);">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>In behandeling</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Wordt verwerkt</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Verzonden</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Afgeleverd</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Geannuleerd</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    return { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' }[status] || 'info';
}

function getStatusLabel(status) {
    return { pending: 'In behandeling', processing: 'Wordt verwerkt', shipped: 'Verzonden', delivered: 'Afgeleverd', cancelled: 'Geannuleerd' }[status] || status;
}

window.updateOrderStatus = async (orderId, newStatus) => {
    try {
        await ordersAPI.updateStatus(orderId, newStatus);
        await loadOrders();
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Fout bij updaten status');
    }
};

document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = '/admin/login.html';
});

loadOrders();
