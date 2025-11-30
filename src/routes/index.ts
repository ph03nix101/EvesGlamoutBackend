import { Router } from 'express';
import productsRouter from './products';
import categoriesRouter from './categories';
import cartRouter from './cart';
import ordersRouter from './orders';
import authRouter from './auth';
import userRouter from './user';

const router = Router();

// Mount all routes
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'WooCommerce Backend API is running' });
});

export default router;
