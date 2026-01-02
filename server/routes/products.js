import express from 'express';
import { authMiddleware, adminMiddleware } from '../auth.js';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../database.js';
import { upload, processImage, deleteImage } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const router = express.Router();

// GET all products (public)
router.get('/', asyncHandler(async (req, res) => {
    const { category, search, sort } = req.query;
    let products = await getAllProducts();

    // Filter by category
    if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
    }

    // Search
    if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }

    // Sort
    if (sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        products.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(products);
}));

// GET single product (public)
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await getProductById(req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
}));

// POST create product (admin only)
router.post('/',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    processImage,
    asyncHandler(async (req, res) => {
        const { name, category, price, description, badge } = req.body;

        // Validation
        if (!name || !category || !price || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const productData = {
            name,
            category,
            price: parseFloat(price),
            description,
            badge: badge || null,
            image: req.processedImage?.url || null
        };

        const newProduct = await createProduct(productData);
        res.status(201).json(newProduct);
    })
);

// PUT update product (admin only)
router.put('/:id',
    authMiddleware,
    adminMiddleware,
    upload.single('image'),
    processImage,
    asyncHandler(async (req, res) => {
        const { name, category, price, description, badge } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (category) updates.category = category;
        if (price) updates.price = parseFloat(price);
        if (description) updates.description = description;
        if (badge !== undefined) updates.badge = badge || null;
        if (req.processedImage) {
            updates.image = req.processedImage.url;

            // Delete old image
            const oldProduct = await getProductById(req.params.id);
            if (oldProduct?.image) {
                const oldFilename = oldProduct.image.split('/').pop();
                await deleteImage(oldFilename);
            }
        }

        const updatedProduct = await updateProduct(req.params.id, updates);
        res.json(updatedProduct);
    })
);

// DELETE product (admin only)
router.delete('/:id',
    authMiddleware,
    adminMiddleware,
    asyncHandler(async (req, res) => {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete associated image
        if (product.image) {
            const filename = product.image.split('/').pop();
            await deleteImage(filename);
        }

        await deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    })
);
