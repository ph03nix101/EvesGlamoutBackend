"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = __importDefault(require("./products"));
const categories_1 = __importDefault(require("./categories"));
const cart_1 = __importDefault(require("./cart"));
const orders_1 = __importDefault(require("./orders"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const router = (0, express_1.Router)();
// Mount all routes
router.use('/products', products_1.default);
router.use('/categories', categories_1.default);
router.use('/cart', cart_1.default);
router.use('/orders', orders_1.default);
router.use('/auth', auth_1.default);
router.use('/user', user_1.default);
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'WooCommerce Backend API is running' });
});
exports.default = router;
