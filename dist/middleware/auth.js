"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const jwt_1 = require("../utils/jwt");
/**
 * Middleware to verify JWT token and attach user to request
 * Returns 401 if token is missing or invalid
 */
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token',
            message: error.message
        });
    }
}
/**
 * Optional auth middleware - doesn't fail if no token present
 * Useful for routes that work for both guests and logged-in users
 */
function optionalAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const decoded = (0, jwt_1.verifyToken)(token);
            req.user = decoded;
        }
    }
    catch (error) {
        // Silently ignore errors - user remains undefined
    }
    next();
}
