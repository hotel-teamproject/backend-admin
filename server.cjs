require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

// 1. 공유 설정 및 미들웨어
const { connectDB } = require('./shared/config/database.cjs');
const { corsOptions } = require('./shared/config/cors.cjs');
const { errorHandler, notFoundHandler } = require('./shared/middleware/errorHandler.cjs');

// 2. 도메인 라우트 불러오기
// 🔴 [중요] 모든 경로 뒤에 .cjs를 꼭 붙여야 합니다! (팀 규칙 준수)
const authRoutes = require('./auth/routes.cjs');
const usersRoutes = require('./users/users.routes.cjs');
const reservationRoutes = require('./reservation/reservation.routes.cjs');
const hotelRoutes = require('./hotel/hotel.routes.cjs');
const couponRoutes = require('./coupon/coupon.routes.cjs');
// [유지] 사용자(HEAD)의 추가 기능 (리뷰, 대시보드)
const reviewRoutes = require('./review/review.routes.cjs');
const dashboardRoutes = require('./dashboard/routes.cjs');

// 3. 앱(Express) 설정
const app = express();

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
    res.json({ message: 'Backend Server is Running!', timestamp: new Date() });
});

// 4. API 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/coupon', couponRoutes);

// [추가] 임포트한 라우트 등록 (이 부분이 없으면 404 에러가 납니다)
app.use('/api/review', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 에러 핸들러
app.use(notFoundHandler);
app.use(errorHandler);

// 5. 서버 실행
const PORT = process.env.PORT || 3000;
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