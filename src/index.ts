import app from './app';

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Start server for local development
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀  WooCommerce Backend API Server`);
    console.log(`🚀  Port: ${PORT}`);
    console.log(`🚀  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀  Frontend: ${FRONTEND_URL}`);
    console.log('🚀 ========================================');
    console.log('');
    console.log(`📍 API endpoints available at: http://localhost:${PORT}/api`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log('');
});
