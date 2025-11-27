require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  🚀 Backend Server Started             ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║  Port: ${String(PORT).padEnd(33)}║
║  URL: http://localhost:${String(PORT).padEnd(28)}║
╚════════════════════════════════════════╝
    `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// 미처리 예외 처리
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});