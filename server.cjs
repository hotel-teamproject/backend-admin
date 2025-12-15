require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

const { connectDB } = require('./shared/config/database.cjs');
const { corsOptions } = require('./shared/config/cors.cjs');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler.cjs');

const authRoutes = require('./auth/routes.cjs');
const usersRoutes = require('./users/users.routes.cjs');
const reservationRoutes = require('./reservation/reservation.routes.cjs');
const hotelRoutes = require('./hotel/hotel.routes.cjs');
const couponRoutes = require('./coupon/coupon.routes.cjs');
const reviewRoutes = require('./review/review.routes.cjs');
const dashboardRoutes = require('./dashboard/routes.cjs');

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.get('/', (req, res) => {
    res.json({ message: 'Backend Server is Running!', timestamp: new Date() });
});

// 1. 인증 라우트 (로그인, 내 정보 등)
app.use('/api/auth', authRoutes);

// 2. 관리자 라우트 (프론트엔드에서 '/admin'을 붙여서 요청함)
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/hotels', hotelRoutes);
app.use('/api/admin/bookings', reservationRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/admin/reviews', reviewRoutes);

// 3. 대시보드 라우트 ('/admin' 없이 요청됨)
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// 🟢 [중요] 포트를 4000으로 고정 (도커/로컬 모두 4000 사용)
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`
  ################################################
  🚀  Hotel Server Started on Port: ${PORT}
  🏠  URL: http://localhost:${PORT}
  ################################################
  `);
});

process.on('SIGTERM', () => {
    server.close(() => { console.log('Process terminated'); });
});