import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
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
