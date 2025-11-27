require('dotenv').config();

const express = require('express');
const { connectDB, disconnectDB } = require('./shared/config/database');
const routes = require('./routes/route');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');

const PORT = process.env.PORT || 3000;

async function start() {
    await connectDB();

    const app = express();
    const cookieParser = require('cookie-parser');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Simple request logger for debugging
    app.use((req, res, next) => {
        console.log('[REQ]', req.method, req.originalUrl);
        next();
    });

    // Mount application routes
    app.use('/', routes);

    // 404 + error handler
    app.use(notFoundHandler);
    app.use(errorHandler);

    const server = app.listen(PORT, () => {
        console.log(`Backend Server Started — env=${process.env.NODE_ENV || 'development'} port=${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
        console.log(`${signal} received. Shutting down...`);
        server.close(async () => {
            try {
                await disconnectDB();
            } catch (e) {
                console.error('Error during DB disconnect', e);
            }
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});