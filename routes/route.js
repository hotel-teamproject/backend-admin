const express = require('express');
const router = express.Router();

// 여기서부터는 '/api' 빼고 도메인만!
const dashboardRoutes = require('../dashboard/routes');
router.use('/dashboard', dashboardRoutes);

const reservationRoutes = require('../reservation/route');
router.use('/reservations', reservationRoutes);

const authRoutes = require('../auth/routes');
router.use('/auth', authRoutes);

const couponRoutes = require('../coupon/route');
router.use('/coupons', couponRoutes);

const hotelRoutes = require('../hotel/routes');
router.use('/hotels', hotelRoutes);

const modelsRoutes = require('../models/route');
router.use('/models', modelsRoutes);

const middlewaresRoutes = require('../middlewares/route');
router.use('/middlewares', middlewaresRoutes);

const noticeRoutes = require('../notice/route');
router.use('/notices', noticeRoutes);

// (__debug_routes 부분 필요하면 여기 밑에 그대로 두기)

module.exports = router;
