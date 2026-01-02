// Recently Viewed Products
const RECENT_VIEWED_KEY = 'coffeemasters_recent_viewed';
const MAX_RECENT_ITEMS = 5;

export function addToRecentlyViewed(product) {
    let recent = JSON.parse(localStorage.getItem(RECENT_VIEWED_KEY) || '[]');

    // Remove if already exists
    recent = recent.filter(p => p.id !== product.id);

    // Add to beginning
    recent.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
    });

    // Keep only MAX_RECENT_ITEMS
    recent = recent.slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(recent));
}

export function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem(RECENT_VIEWED_KEY) || '[]');
}

export function displayRecentlyViewed() {
    const recent = getRecentlyViewed();
    if (recent.length === 0) return;

    const container = document.createElement('section');
    container.className = 'recent-products';
    container.innerHTML = `
    <div class="container">
      <h2>Recent Bekeken</h2>
      <div class="recent-grid" id="recent-grid"></div>
    </div>
  `;

    const productsSection = document.getElementById('products');
    if (productsSection && productsSection.nextSibling) {
        productsSection.parentNode.insertBefore(container, productsSection.nextSibling);
    }

    const grid = container.querySelector('#recent-grid');
    grid.innerHTML = recent.map(product => `
    <div class="recent-card">
      <div class="recent-image">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : ''}
      </div>
      <div class="recent-info">
        <h4>${product.name}</h4>
        <p class="recent-price">€${product.price.toLocaleString('nl-NL')}</p>
      </div>
    </div>
  `).join('');
}

// Wishlist functionality
const WISHLIST_KEY = 'coffeemasters_wishlist';

export function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');

    if (!wishlist.find(p => p.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        return true;
    }
    return false;
}

export function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    wishlist = wishlist.filter(p => p.id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

export function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
}

export function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(p => p.id === productId);
}

// Image optimization utility
export function optimizeImage(url, width = 800) {
    // In a real app, this would call an image optimization service
    // For now, we'll just use the URL as-is but add loading attributes
    return url;
}
