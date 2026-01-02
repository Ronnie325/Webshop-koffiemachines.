import { getToken, clearToken, productsAPI } from '../src/modules/api.js';

// Check authentication
const token = getToken();
if (!token) {
    window.location.href = '/admin/login.html';
}

let products = [];
let editingProductId = null;

// DOM Elements
const productsTbody = document.getElementById('products-tbody');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const addProductBtn = document.getElementById('add-product-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');
const fileUploadArea = document.getElementById('file-upload-area');
const saveBtn = document.getElementById('save-btn');

// Load products
async function loadProducts() {
    try {
        products = await productsAPI.getAll();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    if (products.length === 0) {
        productsTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                    Geen producten gevonden. Voeg je eerste product toe!
                </td>
            </tr>
        `;
        return;
    }

    productsTbody.innerHTML = products.map(product => `
        <tr>
            <td>
                ${product.image
            ? `<img src="${product.image}" alt="${product.name}" class="product-thumb">`
            : '<div class="product-thumb" style="background: var(--gradient-hero);"></div>'
        }
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${getCategoryName(product.category)}</td>
            <td><strong>€${product.price.toLocaleString('nl-NL')}</strong></td>
            <td>${product.badge ? `<span class="badge badge-info">${product.badge}</span>` : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="icon-button" onclick="window.editProduct(${product.id})" title="Bewerken">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="icon-button delete" onclick="window.deleteProduct(${product.id})" title="Verwijderen">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H14M6 4V2H10V4M3 4L4 14H12L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        espresso: 'Espresso',
        filter: 'Filter Koffie',
        automatic: 'Volautomaat',
        capsule: 'Capsule Systeem'
    };
    return names[category] || category;
}

// Modal handlers
function openModal(product = null) {
    editingProductId = product ? product.id : null;

    if (product) {
        document.getElementById('modal-title').textContent = 'Product Bewerken';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-badge').value = product.badge || '';

        if (product.image) {
            imagePreview.src = product.image;
            imagePreview.style.display = 'block';
        }
    } else {
        document.getElementById('modal-title').textContent = 'Nieuw Product';
        productForm.reset();
        imagePreview.style.display = 'none';
    }

    productModal.style.display = 'flex';
}

function closeModal() {
    productModal.style.display = 'none';
    productForm.reset();
    imagePreview.style.display = 'none';
    editingProductId = null;
}

// Image upload preview
fileUploadArea.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Form submit
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        badge: document.getElementById('product-badge').value || null
    };

    const imageFile = imageInput.files[0];

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="loading-spinner"></span> Opslaan...';

        if (editingProductId) {
            await productsAPI.update(editingProductId, formData, imageFile);
        } else {
            await productsAPI.create(formData, imageFile);
        }

        await loadProducts();
        closeModal();
        showNotification('Product succesvol opgeslagen!');

    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Fout bij opslaan product. Probeer opnieuw.', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Opslaan';
    }
});

// Global functions for onclick handlers
window.editProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
        openModal(product);
    }
};

window.deleteProduct = async (id) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
        return;
    }

    try {
        await productsAPI.delete(id);
        await loadProducts();
        showNotification('Product verwijderd!');
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Fout bij verwijderen product.', 'error');
    }
};

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #c82333)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 9999px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners
addProductBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Modal overlay click handler (with null check)
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
});

// Logout
document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    clearToken();
    window.location.href = '/admin/login.html';
});

// Initialize
loadProducts();
