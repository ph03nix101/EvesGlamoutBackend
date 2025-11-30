import { Router } from 'express';
import { wooCommerce } from '../config/woocommerce';

const router = Router();

// Get all categories
router.get('/', async (req, res, next) => {
    try {
        const { data } = await wooCommerce.get('products/categories', req.query);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Get category by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { data } = await wooCommerce.get(`products/categories/${req.params.id}`);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

export default router;
