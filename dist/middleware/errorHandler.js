"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err);
    // WooCommerce API errors
    if (err.response) {
        return res.status(err.response.status || 500).json({
            error: 'WooCommerce API Error',
            message: err.response.data?.message || err.message,
            status: err.response.status,
        });
    }
    // Generic errors
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong',
    });
}
