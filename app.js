// Product Database
const products = [
    {
        id: 1,
        name: 'DeLuxe Espresso Pro',
        category: 'espresso',
        price: 899,
        description: 'Professionele espressomachine met 15 bar pomp en dubbele boiler',
        image: 'espresso1',
        badge: 'Bestseller'
    },
    {
        id: 2,
        name: 'Barista Master X1',
        category: 'espresso',
        price: 1299,
        description: 'Premium espressomachine met PID temperatuurregeling',
        image: 'espresso2',
        badge: 'Premium'
    },
    {
        id: 3,
        name: 'FilterMatic Deluxe',
        category: 'filter',
        price: 249,
        description: 'Programmeerbare filterkoffiemachine met thermoskan',
        image: 'filter1',
        badge: null
    },
    {
        id: 4,
        name: 'AromaSelect Pro',
        category: 'filter',
        price: 189,
        description: 'Filtermachine met aroma-selector en timer functie',
        image: 'filter2',
        badge: null
    },
    {
        id: 5,
        name: 'OneTouch Premium',
        category: 'automatic',
        price: 1599,
        description: 'Volautomatische koffiemachine met melkopschuimer',
        image: 'automatic1',
        badge: 'Premium'
    },
    {
        id: 6,
        name: 'AutoBrew Elite',
        category: 'automatic',
        price: 1899,
        description: 'Complete volautomaat met touch display en app bediening',
        image: 'automatic2',
        badge: 'Nieuw'
    },
    {
        id: 7,
        name: 'CapsulePro Compact',
        category: 'capsule',
        price: 149,
        description: 'Compacte capsule machine met 19 bar druk',
        image: 'capsule1',
        badge: 'Bestseller'
    },
    {
        id: 8,
        name: 'QuickShot Express',
        category: 'capsule',
        price: 199,
        description: 'Snelle capsule machine met melkopschuimer',
        image: 'capsule2',
        badge: null
    },
    {
        id: 9,
        name: 'Espresso Classic',
        category: 'espresso',
        price: 549,
        description: 'Klassieke espressomachine met RVS afwerking',
        image: 'espresso3',
        badge: null
    },
    {
        id: 10,
        name: 'BrewMaster 3000',
        category: 'filter',
        price: 299,
        description: 'Filter koffiemachine met glazen kan en warmhoudplaat',
        image: 'filter3',
        badge: null
    },
    {
        id: 11,
        name: 'SmartBean Automatic',
        category: 'automatic',
        price: 2199,
        description: 'Slimme volautomaat met bonen-tot-kop systeem',
        image: 'automatic3',
        badge: 'Premium'
    },
    {
        id: 12,
        name: 'MiniPress Capsule',
        category: 'capsule',
        price: 99,
        description: 'Betaalbare capsule machine voor kleine keukens',
        image: 'capsule3',
        badge: 'Voordeel'
    }
];

// Shopping Cart
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    setupScrollEffects();
    loadCart();
});

// Load Products
function loadProducts(filter = 'all') {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;

    const imageColor = getImageColor(product.category);

    card.innerHTML = `
        <div class="product-image" style="background: ${imageColor}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" style="opacity: 0.3">
                ${getProductIcon(product.category)}
            </svg>
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

    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product.id));
    return card;
}

// Get Product Icon
function getProductIcon(category) {
    const icons = {
        espresso: '<path d="M30 40H110V70C110 85.464 97.464 98 82 98H58C42.536 98 30 85.464 30 70V40Z" stroke="currentColor" stroke-width="4"/><path d="M110 55H125C129.418 55 133 58.582 133 63V70C133 74.418 129.418 78 125 78H110" stroke="currentColor" stroke-width="4"/><path d="M45 98V108C45 111.314 47.686 114 51 114H89C92.314 114 95 111.314 95 108V98" stroke="currentColor" stroke-width="4"/>',
        filter: '<path d="M40 35L100 35L85 70V105L55 115V70L40 35Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>',
        automatic: '<rect x="35" y="25" width="90" height="105" rx="8" stroke="currentColor" stroke-width="4"/><circle cx="80" cy="65" r="15" stroke="currentColor" stroke-width="4"/><path d="M55 100H105" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M55 115H105" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>',
        capsule: '<rect x="50" y="30" width="60" height="90" rx="30" stroke="currentColor" stroke-width="4"/><path d="M50 80H110" stroke="currentColor" stroke-width="4"/><circle cx="80" cy="60" r="6" fill="currentColor"/>'
    };
    return icons[category] || icons.espresso;
}

// Get Image Color
function getImageColor(category) {
    const colors = {
        espresso: 'linear-gradient(135deg, hsl(25, 75%, 95%) 0%, hsl(30, 70%, 90%) 100%)',
        filter: 'linear-gradient(135deg, hsl(200, 70%, 95%) 0%, hsl(210, 65%, 90%) 100%)',
        automatic: 'linear-gradient(135deg, hsl(280, 60%, 95%) 0%, hsl(290, 55%, 90%) 100%)',
        capsule: 'linear-gradient(135deg, hsl(150, 60%, 95%) 0%, hsl(160, 55%, 90%) 100%)'
    };
    return colors[category] || colors.espresso;
}

// Get Category Name
function getCategoryName(category) {
    const names = {
        espresso: 'Espresso',
        filter: 'Filter Koffie',
        automatic: 'Volautomaat',
        capsule: 'Capsule Systeem'
    };
    return names[category] || category;
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            loadProducts(filter);
        });
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                const filterBtn = document.querySelector(`[data-filter="${category}"]`);
                if (filterBtn) {
                    filterBtn.classList.add('active');
                    loadProducts(category);
                }
            }, 500);
        });
    });

    // Cart button
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.querySelector('.modal-overlay').addEventListener('click', closeCart);

    // Hero buttons
    document.getElementById('shop-now-btn').addEventListener('click', () => {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('learn-more-btn').addEventListener('click', () => {
        document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
    });

    // Newsletter
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        alert(`Bedankt voor je inschrijving, ${email}!`);
        e.target.reset();
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Je winkelwagen is leeg');
            return;
        }
        alert('Bedankt voor je bestelling! Totaal: €' + calculateTotal().toLocaleString('nl-NL'));
        cart = [];
        updateCart();
        closeCart();
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    saveCart();
    showNotification('Product toegevoegd aan winkelwagen!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Update Cart
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Je winkelwagen is leeg</p>';
        totalPrice.textContent = '€0,00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image" style="background: ${getImageColor(item.category)}"></div>
            <div class="cart-item-content">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">€${item.price.toLocaleString('nl-NL')} × ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `).join('');

    totalPrice.textContent = '€' + calculateTotal().toLocaleString('nl-NL');
}

// Calculate Total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Open/Close Cart
function openCart() {
    document.getElementById('cart-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
    document.body.style.overflow = '';
}

// Save/Load Cart
function saveCart() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('coffeeCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Scroll Effects
function setupScrollEffects() {
    const navbar = document.getElementById('main-navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.category-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
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

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
