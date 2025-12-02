require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./shared/config/database');
const { corsOptions } = require('./shared/config/cors');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');

// 1. 도메인 라우트 임포트
const authRoutes = require('./auth/routes');
const usersRoutes = require('./users/users.routes');
const reservationRoutes = require('./reservation/reservation.routes'); 
const hotelRoutes = require('./hotel/hotel.routes'); 
const couponRoutes = require('./coupon/coupon.routes'); // ⬅️ [NEW] 쿠폰 추가!

const app = express();

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// DB 연결
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// 헬스 체크
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running', timestamp: new Date() });
});

// 2. API 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reservation', reservationRoutes); 
app.use('/api/hotel', hotelRoutes);
app.use('/api/coupon', couponRoutes); // ⬅️ [NEW] /api/coupon 주소 오픈!

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

module.exports = app;