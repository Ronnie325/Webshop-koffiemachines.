// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Token management
let authToken = localStorage.getItem('admin_token');

export function setToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem('admin_token', token);
    } else {
        localStorage.removeItem('admin_token');
    }
}

export function getToken() {
    return authToken;
}

export function clearToken() {
    authToken = null;
    localStorage.removeItem('admin_token');
}

// Fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add auth token if available
    if (authToken && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Handle 401 - token expired
        if (response.status === 401) {
            clearToken();
            if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login.html';
            }
            throw new Error('Authentication required');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Products API
export const productsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/products${query ? '?' + query : ''}`, { skipAuth: true });
    },

    getById: (id) => apiFetch(`/products/${id}`, { skipAuth: true }),

    create: async (data, image) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        if (image) {
            formData.append('image', image);
        }

        return apiFetch('/products', {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    },

    update: async (id, data, image) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        if (image) {
            formData.append('image', image);
        }

        return apiFetch(`/products/${id}`, {
            method: 'PUT',
            body: formData,
            headers: {}
        });
    },

    delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' })
};

// Auth API
export const authAPI = {
    login: (username, password) =>
        apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            skipAuth: true
        }),

    verify: (token) =>
        apiFetch('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token }),
            skipAuth: true
        })
};

// Orders API
export const ordersAPI = {
    getAll: () => apiFetch('/orders'),

    getById: (id) => apiFetch(`/orders/${id}`, { skipAuth: true }),

    create: (data) =>
        apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
            skipAuth: true
        }),

    updateStatus: (id, status) =>
        apiFetch(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
};

export default {
    products: productsAPI,
    auth: authAPI,
    orders: ordersAPI,
    setToken,
    getToken,
    clearToken
};
