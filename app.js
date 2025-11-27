require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./shared/config/database');
const { corsOptions } = require('./shared/config/cors');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler');

// 도메인 라우트 임포트
const authRoutes = require('./auth/routes');
// const postRoutes = require('./posts/routes');
// const adminRoutes = require('./admin/routes');
// const uploadRoutes = require('./upload/routes');
// const couponRoutes = require('./coupon/routes');
// const hotelRoutes = require('./hotel/routes');
// const reservationRoutes = require('./reservation/routes');
// const noticeRoutes = require('./notice/routes');

const app = express();

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// DB 연결 (앱 시작 시)
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// 헬스 체크
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running', timestamp: new Date() });
});

// API 라우트 등록
app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/coupon', couponRoutes);
// app.use('/api/hotel', hotelRoutes);
// app.use('/api/reservation', reservationRoutes);
// app.use('/api/notice', noticeRoutes);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러 (마지막에 위치)
app.use(errorHandler);

module.exports = app;
