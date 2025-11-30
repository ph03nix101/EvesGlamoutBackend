import { Router } from 'express';
import { wooCommerce } from '../config/woocommerce';

const router = Router();

// Create order
router.post('/', async (req, res, next) => {
    try {
        const { data } = await wooCommerce.post('orders', req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
});

// Get order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { data } = await wooCommerce.get(`orders/${req.params.id}`);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get all orders (optionally filtered by customer)
router.get('/', async (req, res, next) => {
    try {
        const { data } = await wooCommerce.get('orders', req.query);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
