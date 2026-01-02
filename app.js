import { loadProducts, setupFilters, showNotification } from './src/modules/products.js';
import { loadCart, updateCartUI, getCartSummary, clearCart } from './src/modules/cart.js';
import { ordersAPI } from './src/modules/api.js';

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
