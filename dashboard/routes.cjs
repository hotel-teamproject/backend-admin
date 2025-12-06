const express = require('express');
const router = express.Router();

// 기존 JS 컨트롤러 재사용
const controller = require('./controller.cjs');

// 대시보드 개요
router.get('/overview', controller.overview);

// 일별 매출
router.get('/revenue', controller.revenueByDays);

// 최근 예약
router.get('/recent-bookings', controller.recentBookings);

module.exports = router;


