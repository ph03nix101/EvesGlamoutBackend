"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const woocommerce_1 = require("../config/woocommerce");
const redis_1 = __importDefault(require("../config/redis"));
const router = (0, express_1.Router)();
const CART_EXPIRY_SECONDS = 86400; // 24 hours
// Generate session ID from request
function getSessionId(req) {
    return req.headers['x-session-id'] || 'default-session';
}
// Get cart from Redis
async function getCartFromRedis(sessionId) {
    const cartData = await redis_1.default.get(`cart:${sessionId}`);
    if (!cartData) {
        return { items: [] };
    }
    return JSON.parse(cartData);
}
// Save cart to Redis with expiration
async function saveCartToRedis(sessionId, cart) {
    await redis_1.default.setex(`cart:${sessionId}`, CART_EXPIRY_SECONDS, JSON.stringify(cart));
}
/**
 * GET /cart - Get cart items
 */
router.get('/', async (req, res, next) => {
    try {
        const sessionId = getSessionId(req);
        const cart = await getCartFromRedis(sessionId);
        res.json({
            items: cart.items,
            totals: calculateTotals(cart.items),
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /cart - Add item to cart
 */
router.post('/', async (req, res, next) => {
    try {
        const { productId, quantity = 1, variations } = req.body;
        const sessionId = getSessionId(req);
        // Fetch product details from WooCommerce
        const { data: product } = await woocommerce_1.wooCommerce.get(`products/${productId}`);
        // Get cart from Redis
        let cart = await getCartFromRedis(sessionId);
        // Generate unique key for this item
        const itemKey = `${productId}-${variations ? JSON.stringify(variations) : 'simple'}`;
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(item => item.key === itemKey);
        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            // Add new item
            const newItem = {
                key: itemKey,
                id: String(product.id),
                product_id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.images[0]?.src || '/placeholder.svg',
                price: parseFloat(product.price),
                quantity,
                variations: variations || [],
                stock_status: product.stock_status || 'instock',
            };
            cart.items.push(newItem);
        }
        // Save back to Redis
        await saveCartToRedis(sessionId, cart);
        res.json({
            items: cart.items,
            totals: calculateTotals(cart.items),
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * PUT /cart/:itemKey - Update cart item quantity
 */
router.put('/:itemKey', async (req, res, next) => {
    try {
        const { itemKey } = req.params;
        const { quantity } = req.body;
        const sessionId = getSessionId(req);
        const cart = await getCartFromRedis(sessionId);
        const itemIndex = cart.items.findIndex(item => item.key === itemKey);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }
        if (quantity <= 0) {
            // Remove item
            cart.items.splice(itemIndex, 1);
        }
        else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }
        await saveCartToRedis(sessionId, cart);
        res.json({
            items: cart.items,
            totals: calculateTotals(cart.items),
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * DELETE /cart/:itemKey - Remove item from cart
 */
router.delete('/:itemKey', async (req, res, next) => {
    try {
        const { itemKey } = req.params;
        const sessionId = getSessionId(req);
        const cart = await getCartFromRedis(sessionId);
        cart.items = cart.items.filter(item => item.key !== itemKey);
        await saveCartToRedis(sessionId, cart);
        res.json({
            items: cart.items,
            totals: calculateTotals(cart.items),
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * DELETE /cart - Clear entire cart
 */
router.delete('/', async (req, res, next) => {
    try {
        const sessionId = getSessionId(req);
        // Delete cart from Redis
        await redis_1.default.del(`cart:${sessionId}`);
        res.json({
            items: [],
            totals: { subtotal: 0, total: 0 },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Calculate cart totals
 */
function calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
        subtotal,
        total: subtotal,
    };
}
exports.default = router;
