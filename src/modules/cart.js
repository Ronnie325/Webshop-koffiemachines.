// Shopping cart state
let cart = [];
const CART_STORAGE_KEY = 'coffeemasters_cart';

// Cart events
const cartChangeEvent = new Event('cartchange');

// Load cart from localStorage
export function loadCart() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
            cart = JSON.parse(saved);
            dispatchCartChange();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
    return cart;
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        dispatchCartChange();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Dispatch cart change event
function dispatchCartChange() {
    window.dispatchEvent(cartChangeEvent);
}

// Get cart
export function getCart() {
    return [...cart];
}

// Get cart count
export function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Add item to cart
export function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity
        });
    }

    saveCart();
    return cart;
}

// Update cart item quantity
export function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
        }
    }

    return cart;
}

// Remove item from cart
export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    return cart;
}

// Clear cart
export function clearCart() {
    cart = [];
    saveCart();
    return cart;
}

// Calculate total
export function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart summary  
export function getCartSummary() {
    return {
        items: getCart(),
        count: getCartCount(),
        total: calculateTotal()
    };
}

// Update cart UI
export function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');

    if (cartCountEl) {
        cartCountEl.textContent = getCartCount();
    }

    if (cartItemsEl) {
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Je winkelwagen is leeg</p>';
        } else {
            cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-image" style="background: linear-gradient(135deg, hsl(25, 75%, 95%) 0%, hsl(30, 70%, 90%) 100%)">
            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
          </div>
          <div class="cart-item-content">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">€${item.price.toLocaleString('nl-NL')} × ${item.quantity}</div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Verwijderen">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      `).join('');

            // Add remove handlers
            cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    removeFromCart(id);
                    updateCartUI();
                });
            });
        }
    }

    if (totalPriceEl) {
        totalPriceEl.textContent = '€' + calculateTotal().toLocaleString('nl-NL');
    }
}

// Listen for cart changes
window.addEventListener('cartchange', updateCartUI);

// Initialize cart on load
loadCart();

export default {
    loadCart,
    getCart,
    getCartCount,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    getCartSummary,
    updateCartUI
};
