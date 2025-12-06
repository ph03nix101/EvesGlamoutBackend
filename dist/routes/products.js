"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const woocommerce_1 = require("../config/woocommerce");
const router = (0, express_1.Router)();
// Get all products
router.get('/', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get('products', req.query);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get(`products/${req.params.id}`);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get product by slug
router.get('/slug/:slug', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get('products', { slug: req.params.slug });
        res.json(data[0] || null);
    }
    catch (error) {
        next(error);
    }
});
// Search products
router.get('/search/:query', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get('products', {
            search: req.params.query,
            per_page: req.query.limit || 10,
            status: 'publish',
        });
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get related products
router.get('/:id/related', async (req, res, next) => {
    try {
        // First get the product to find its related IDs
        const { data: product } = await woocommerce_1.wooCommerce.get(`products/${req.params.id}`);
        if (!product.related_ids || product.related_ids.length === 0) {
            return res.json([]);
        }
        // Fetch related products
        const { data } = await woocommerce_1.wooCommerce.get('products', {
            include: product.related_ids.join(','),
            per_page: 4,
        });
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get product reviews
router.get('/:id/reviews', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get(`products/${req.params.id}/reviews`);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
