import { loadProducts, setupFilters, showNotification } from './src/modules/products.js';
import { loadCart, updateCartUI, getCartSummary, clearCart } from './src/modules/cart.js';
import { ordersAPI } from './src/modules/api.js';

// Dark Mode & Search
function setupDarkMode() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (!document.querySelector('.theme-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        toggleBtn.innerHTML = `
      <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.querySelector('.sun-icon').style.display = newTheme === 'dark' ? 'none' : 'block';
            toggleBtn.querySelector('.moon-icon').style.display = newTheme === 'dark' ? 'block' : 'none';
        });

        if (currentTheme === 'dark') {
            toggleBtn.querySelector('.sun-icon').style.display = 'none';
            toggleBtn.querySelector('.moon-icon').style.display = 'block';
        }
    }
}

function setupSearch() {
    const productsSection = document.getElementById('products');
    if (!productsSection || document.querySelector('.search-container')) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
    <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="8" cy="8" r="6"/><path d="M14 14L18 18"/>
    </svg>
    <input type="text" class="search-input" placeholder="Zoek producten..." id="product-search">
  `;

    const filterBtns = document.querySelector('.filter-buttons');
    if (filterBtns) filterBtns.parentNode.insertBefore(searchContainer, filterBtns);

    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        let timeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const term = e.target.value.toLowerCase();
                const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
                loadProducts(filter, null, term);
            }, 300);
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Load cart
    loadCart();
    updateCartUI();

    // Load products
    await loadProducts();

    // Setup event listeners
    setupFilters();
    setupNavigation();
    setupCart();
    setupHeroButtons();
    setupNewsletter();
    setupCategoryCards();
    setupScrollEffects();
    setupDarkMode();
    setupSearch();

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    }

    console.log('✅ App initialized');
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Cart modal
function setupCart() {
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartModal = document.getElementById('cart-modal');
    const modalOverlay = cartModal?.querySelector('.modal-overlay');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeCartModal);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

function openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartUI();
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function handleCheckout() {
    const { items, total } = getCartSummary();

    if (items.length === 0) {
        showNotification('Je winkelwagen is leeg', 'error');
        return;
    }

    // In a real app, you'd show a checkout form
    // For now, we'll create a simple order
    try {
        const order = await ordersAPI.create({
            items: items.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            customer: {
                name: 'Guest User',
                email: 'guest@example.com'
            },
            total
        });

        showNotification(`Bestelling geplaatst! Order #${order.id}`);
        clearCart();
        updateCartUI();
        closeCartModal();
    } catch (error) {
        showNotification('Fout bij plaatsen bestelling. Probeer opnieuw.', 'error');
        console.error('Checkout error:', error);
    }
}

// Hero buttons
function setupHeroButtons() {
    const shopNowBtn = document.getElementById('shop-now-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn');

    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Newsletter
function setupNewsletter() {
    const form = document.getElementById('newsletter-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input')?.value;
            if (email) {
                showNotification(`Bedankt voor je inschrijving, ${email}!`);
                form.reset();
            }
        });
    }
}

// Category cards navigation
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;

            // Scroll to products
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

            // Activate filter after scroll
            setTimeout(() => {
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => btn.classList.remove('active'));

                const targetBtn = document.querySelector(`[data-filter="${category}"]`);
                if (targetBtn) {
                    targetBtn.classList.add('active');
                    loadProducts(category);
                }
            }, 500);
        });
    });
}

// Scroll effects
function setupScrollEffects() {
    const navbar = document.getElementById('main-navbar');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Intersection observer for animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    // Observe category and feature cards
    document.querySelectorAll('.category-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
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
  .loading, .error, .no-products {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }
  .error {
    color: #e74c3c;
  }
`;
document.head.appendChild(style);
