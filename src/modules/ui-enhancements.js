// Dark Mode Implementation
function setupDarkMode() {
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Create dark mode toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        toggleBtn.innerHTML = `
      <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="display: none;">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;
        document.body.appendChild(toggleBtn);

        // Toggle theme
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Toggle icons
            const sunIcon = toggleBtn.querySelector('.sun-icon');
            const moonIcon = toggleBtn.querySelector('.moon-icon');
            if (newTheme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }

            showToast(`${newTheme === 'dark' ? 'Donkere' : 'Lichte'} modus geactiveerd`, 'info');
        });

        // Set initial icon state
        if (currentTheme === 'dark') {
            toggleBtn.querySelector('.sun-icon').style.display = 'none';
            toggleBtn.querySelector('.moon-icon').style.display = 'block';
        }
    }
}

// Search Functionality
function setupSearch() {
    const productsSection = document.getElementById('products');
    if (!productsSection || document.querySelector('.search-container')) return;

    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
    <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <circle cx="8" cy="8" r="6"/>
      <path d="M14 14L18 18"/>
    </svg>
    <input type="text" class="search-input" placeholder="Zoek producten..." id="product-search">
  `;

    // Insert before product filters
    const filterBtns = document.querySelector('.filter-buttons');
    if (filterBtns) {
        filterBtns.parentNode.insertBefore(searchContainer, filterBtns);
    }

    // Search functionality
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            loadProducts(activeFilter, null, searchTerm);
        }, 300));
    }
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      ${type === 'success' ? '<path d="M5 10L8 13L15 6"/>' :
            type === 'error' ? '<path d="M6 6L14 14M6 14L14 6"/>' :
                '<circle cx="10" cy="10" r="8"/><path d="M10 6V10M10 14H10.01"/>'}
    </svg>
    <span>${message}</span>
  `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make showToast globally available
window.showToast = showToast;
