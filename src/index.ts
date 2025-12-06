import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Middleware
app.use(cors({
    origin: '*',  // Allow all origins for now
    credentials: false,
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes - mount without /api prefix since Vercel will handle that
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Export for Vercel serverless
export default app;
