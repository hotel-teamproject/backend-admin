const express = require('express');
const router = express.Router();
const controller = require('./controller');

// 대시보드 개요
router.get('/overview', controller.overview);

// 최근 N일 매출
router.get('/revenue', controller.revenueByDays);

// 최근 예약 목록
router.get('/recent-bookings', controller.recentBookings);

module.exports = router;
