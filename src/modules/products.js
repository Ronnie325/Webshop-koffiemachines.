import { productsAPI } from './api.js';
import { addToCart } from './cart.js';

// Product rendering state
let currentFilter = 'all';
let currentSort = null;
let currentSearch = '';
let allProducts = [];

// Get category display name
function getCategoryName(category) {
    const names = {
        espresso: 'Espresso',
        filter: 'Filter Koffie',
        automatic: 'Volautomaat',
        capsule: 'Capsule Systeem'
    };
    return names[category] || category;
}

// Get product icon SVG
function getProductIcon(category) {
    const icons = {
        espresso: '<path d="M30 40H110V70C110 85.464 97.464 98 82 98H58C42.536 98 30 85.464 30 70V40Z" stroke="currentColor" stroke-width="4"/><path d="M110 55H125C129.418 55 133 58.582 133 63V70C133 74.418 129.418 78 125 78H110" stroke="currentColor" stroke-width="4"/><path d="M45 98V108C45 111.314 47.686 114 51 114H89C92.314 114 95 111.314 95 108V98" stroke="currentColor" stroke-width="4"/>',
        filter: '<path d="M40 35L100 35L85 70V105L55 115V70L40 35Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
        automatic: '<rect x="35" y="25" width="90" height="105" rx="8" stroke="currentColor" stroke-width="4"/><circle cx="80" cy="65" r="15" stroke="currentColor" stroke-width="4"/><path d="M55 100H105" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M55 115H105" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
        capsule: '<rect x="50" y="30" width="60" height="90" rx="30" stroke="currentColor" stroke-width="4"/><path d="M50 80H110" stroke="currentColor" stroke-width="4"/><circle cx="80" cy="60" r="6" fill="currentColor"/>'
    };
    return icons[category] || icons.espresso;
}

// Get image gradient based on category
function getImageColor(category) {
    const colors = {
        espresso: 'linear-gradient(135deg, hsl(25, 75%, 95%) 0%, hsl(30, 70%, 90%) 100%)',
        filter: 'linear-gradient(135deg, hsl(200, 70%, 95%) 0%, hsl(210, 65%, 90%) 100%)',
        automatic: 'linear-gradient(135deg, hsl(280, 60%, 95%) 0%, hsl(290, 55%, 90%) 100%)',
        capsule: 'linear-gradient(135deg, hsl(150, 60%, 95%) 0%, hsl(160, 55%, 90%) 100%)'
    };
    return colors[category] || colors.espresso;
}

// Create product card element
export function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.dataset.id = product.id;

    const imageColor = getImageColor(product.category);
    const categoryIcon = getProductIcon(product.category);

    // Use lazy loading for images
    const imageHTML = product.image
        ? `<img src="${product.image}" alt="${product.name}" class="lazy-image" loading="lazy" onerror="this.style.display='none'">`
        : `<svg width="160" height="160" viewBox="0 0 160 160" fill="none" style="opacity: 0.3">${categoryIcon}</svg>`;

    card.innerHTML = `
    <div class="product-image" style="background: ${imageColor}">
      ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      ${imageHTML}
    </div>
    <div class="product-content">
      <div class="product-category">${getCategoryName(product.category)}</div>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer">
        <div class="product-price">€${product.price.toLocaleString('nl-NL')}</div>
        <button class="add-to-cart" data-id="${product.id}" aria-label="Toevoegen aan winkelwagen">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 1H4L6 13H17L19 5H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="7" cy="17" r="1" fill="currentColor"/>
            <circle cx="15" cy="17" r="1" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  `;

    // Add to cart functionality
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);

            // Visual feedback
            addToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2"/></svg>';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 1H4L6 13H17L19 5H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="17" r="1" fill="currentColor"/><circle cx="15" cy="17" r="1" fill="currentColor"/></svg>';
            }, 1000);
        });
    }

    return card;
}

// Load and display products
export async function loadProducts(filter = 'all', sort = null, search = '') {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    try {
        // Show loading state
        productGrid.innerHTML = '<div class="loading">Producten laden...</div>';

        // Fetch products with filters
        const params = {};
        if (filter !== 'all') params.category = filter;
        if (sort) params.sort = sort;
        if (search) params.search = search;

        const products = await productsAPI.getAll(params);
        allProducts = products;

        // Clear grid
        productGrid.innerHTML = '';

        // Render products
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="no-products">Geen producten gevonden</div>';
            return;
        }

        products.forEach(product => {
            const card = createProductCard(product);
            productGrid.appendChild(card);
        });

        // Update current state
        currentFilter = filter;
        currentSort = sort;
        currentSearch = search;

    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = '<div class="error">Fout bij laden van producten. Probeer het opnieuw.</div>';
    }
}

// Setup filter buttons
export function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            loadProducts(filter, currentSort, currentSearch);
        });
    });
}

// Setup search
export function setupSearch() {
    const searchBtn = document.getElementById('search-btn');
    // Search implementation will be added when search modal is created
}

// Show notification
export function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, hsl(25, 75%, 48%) 0%, hsl(40, 85%, 55%) 100%);
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
    }, 2500);
}

export default {
    loadProducts,
    createProductCard,
    setupFilters,
    setupSearch,
    showNotification
};
