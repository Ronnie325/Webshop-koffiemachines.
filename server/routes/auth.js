import express from 'express';
import { verifyCredentials, generateToken } from '../auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const router = express.Router();

// POST login
router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await verifyCredentials(username, password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
}));

// POST verify token
router.post('/verify', asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token required' });
    }

    const { verifyToken } = await import('../auth.js');
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ valid: true, user: decoded });
}));
