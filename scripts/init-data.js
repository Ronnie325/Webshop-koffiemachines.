import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const SEED_FILE = path.join(DATA_DIR, 'products-seed.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

async function initializeData() {
    try {
        console.log('🌱 Initializing database with seed data...');

        // Ensure data directory exists
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Check if products.json already has data
        try {
            const existingData = await fs.readFile(PRODUCTS_FILE, 'utf-8');
            const products = JSON.parse(existingData);
            if (products.length > 0) {
                console.log(`✅ Database already contains ${products.length} products. Skipping seed.`);
                return;
            }
        } catch (error) {
            // File doesn't exist or is empty, continue with seeding
        }

        // Load seed data
        const seedData = await fs.readFile(SEED_FILE, 'utf-8');
        const products = JSON.parse(seedData);

        // Write to products.json
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));

        console.log(`✅ Seeded ${products.length} products successfully!`);
        console.log('📦 Products:');
        products.forEach(p => {
            console.log(`   - ${p.name} (€${p.price})`);
        });

    } catch (error) {
        console.error('❌ Error initializing data:', error);
        process.exit(1);
    }
}

initializeData();
