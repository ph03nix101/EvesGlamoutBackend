"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const woocommerce_1 = require("../config/woocommerce");
const router = (0, express_1.Router)();
// Create order
router.post('/', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.post('orders', req.body);
        res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get(`orders/${req.params.id}`);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get all orders (optionally filtered by customer)
router.get('/', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get('orders', req.query);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
