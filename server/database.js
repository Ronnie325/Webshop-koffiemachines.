import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Initialize database files
export async function initDatabase() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Check and create products file
        try {
            await fs.access(PRODUCTS_FILE);
        } catch {
            await fs.writeFile(PRODUCTS_FILE, JSON.stringify([], null, 2));
        }

        // Check and create orders file
        try {
            await fs.access(ORDERS_FILE);
        } catch {
            await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
        }

        // Check and create categories file
        try {
            await fs.access(CATEGORIES_FILE);
        } catch {
            const defaultCategories = [
                { id: 'espresso', name: 'Espresso', description: 'Voor de echte koffiekenner' },
                { id: 'filter', name: 'Filter Koffie', description: 'Klassiek en betrouwbaar' },
                { id: 'automatic', name: 'Volautomaat', description: 'Gemak op knopdruk' },
                { id: 'capsule', name: 'Capsule Systemen', description: 'Snel en eenvoudig' }
            ];
            await fs.writeFile(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2));
        }

        console.log('✅ Database initialized');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

// Products CRUD
export async function getAllProducts() {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
}

export async function getProductById(id) {
    const products = await getAllProducts();
    return products.find(p => p.id === parseInt(id));
}

export async function createProduct(product) {
    const products = await getAllProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return newProduct;
}

export async function updateProduct(id, updates) {
    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        throw new Error('Product not found');
    }
    products[index] = {
        ...products[index],
        ...updates,
        id: products[index].id, // Preserve ID
        updatedAt: new Date().toISOString()
    };
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return products[index];
}

export async function deleteProduct(id) {
    const products = await getAllProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    if (filtered.length === products.length) {
        throw new Error('Product not found');
    }
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filtered, null, 2));
    return true;
}

// Orders CRUD
export async function getAllOrders() {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
}

export async function getOrderById(id) {
    const orders = await getAllOrders();
    return orders.find(o => o.id === id);
}

export async function createOrder(order) {
    const orders = await getAllOrders();
    const newOrder = {
        id: Date.now().toString(),
        ...order,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return newOrder;
}

export async function updateOrder(id, updates) {
    const orders = await getAllOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
        throw new Error('Order not found');
    }
    orders[index] = {
        ...orders[index],
        ...updates,
        id: orders[index].id,
        updatedAt: new Date().toISOString()
    };
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return orders[index];
}

// Categories
export async function getAllCategories() {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
}

// Initialize on import
initDatabase();
