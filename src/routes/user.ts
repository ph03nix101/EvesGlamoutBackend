import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { wooCommerce } from '../config/woocommerce';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

/**
 * GET /api/user/profile
 * Get user profile from WooCommerce customer
 */
router.get('/profile', async (req: AuthRequest, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { data } = await wooCommerce.get(`customers/${userId}`);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', async (req: AuthRequest, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { data } = await wooCommerce.put(`customers/${userId}`, req.body);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/user/orders
 * Get user order history
 */
router.get('/orders', async (req: AuthRequest, res, next) => {
    try {
        const userEmail = req.user?.email;

        if (!userEmail) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Fetch orders by billing email instead of customer ID
        const { data: allOrders } = await wooCommerce.get('orders', {
            per_page: 100,
            orderby: 'date',
            order: 'desc',
        });

        // Filter orders by billing email
        const userOrders = allOrders.filter((order: any) =>
            order.billing?.email?.toLowerCase() === userEmail.toLowerCase()
        );

        res.json(userOrders);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/user/orders/:id
 * Get specific order details
 */
router.get('/orders/:id', async (req: AuthRequest, res, next) => {
    try {
        const userId = req.user?.id;
        const orderId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { data } = await wooCommerce.get(`orders/${orderId}`);

        // Verify order belongs to user
        if (data.customer_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/user/addresses
 * Get saved addresses from customer profile
 */
router.get('/addresses', async (req: AuthRequest, res, next) => {
    try {
        const userEmail = req.user?.email;

        if (!userEmail) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find customer by email
        const { data: customers } = await wooCommerce.get('customers', {
            email: userEmail,
        });

        if (!customers || customers.length === 0) {
            // No customer found, return empty addresses
            return res.json({
                billing: {},
                shipping: {},
            });
        }

        const customer = customers[0];

        // Return billing and shipping addresses
        res.json({
            billing: customer.billing,
            shipping: customer.shipping,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/user/addresses
 * Update billing/shipping addresses
 */
router.put('/addresses', async (req: AuthRequest, res, next) => {
    try {
        const userEmail = req.user?.email;
        const userDisplayName = req.user?.displayName;

        if (!userEmail) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find customer by email
        const { data: customers } = await wooCommerce.get('customers', {
            email: userEmail,
        });

        let customerId;

        if (!customers || customers.length === 0) {
            // Customer doesn't exist, create one
            const { data: newCustomer } = await wooCommerce.post('customers', {
                email: userEmail,
                username: userEmail.split('@')[0] + '_' + Date.now(), // Ensure unique username
                first_name: userDisplayName?.split(' ')[0] || '',
                last_name: userDisplayName?.split(' ')[1] || '',
            });
            customerId = newCustomer.id;
        } else {
            customerId = customers[0].id;
        }

        const { billing, shipping } = req.body;

        const updateData: any = {};
        if (billing) updateData.billing = billing;
        if (shipping) updateData.shipping = shipping;

        const { data } = await wooCommerce.put(`customers/${customerId}`, updateData);

        res.json({
            billing: data.billing,
            shipping: data.shipping,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
