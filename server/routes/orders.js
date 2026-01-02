import express from 'express';
import { authMiddleware } from '../auth.js';
import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder
} from '../database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const router = express.Router();

// GET all orders (admin only)
router.get('/',
    authMiddleware,
    asyncHandler(async (req, res) => {
        const orders = await getAllOrders();
        res.json(orders);
    })
);

// GET single order
router.get('/:id',
    asyncHandler(async (req, res) => {
        const order = await getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    })
);

// POST create order (public - checkout)
router.post('/',
    asyncHandler(async (req, res) => {
        const { items, customer, total } = req.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain items' });
        }

        if (!customer || !customer.name || !customer.email) {
            return res.status(400).json({ error: 'Customer information required' });
        }

        if (!total || total <= 0) {
            return res.status(400).json({ error: 'Invalid order total' });
        }

        const orderData = {
            items,
            customer,
            total,
            status: 'pending'
        };

        const newOrder = await createOrder(orderData);
        res.status(201).json(newOrder);
    })
);

// PUT update order status (admin only)
router.put('/:id/status',
    authMiddleware,
    asyncHandler(async (req, res) => {
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedOrder = await updateOrder(req.params.id, { status });
        res.json(updatedOrder);
    })
);
