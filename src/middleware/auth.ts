import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: any;
}

/**
 * Middleware to verify JWT token and attach user to request
 * Returns 401 if token is missing or invalid
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    } catch (error: any) {
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
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const decoded = verifyToken(token);
            req.user = decoded;
        }
    } catch (error) {
        // Silently ignore errors - user remains undefined
    }
    next();
}
