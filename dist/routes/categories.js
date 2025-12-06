"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const woocommerce_1 = require("../config/woocommerce");
const router = (0, express_1.Router)();
// Get all categories
router.get('/', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get('products/categories', req.query);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
// Get category by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { data } = await woocommerce_1.wooCommerce.get(`products/categories/${req.params.id}`);
        res.json(data);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
