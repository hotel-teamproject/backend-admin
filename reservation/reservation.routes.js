const express = require('express');
const router = express.Router();
// 파일 경로를 확실하게 지정합니다 (같은 폴더의 reservation.controller.js)
const reservationController = require('./reservation.controller');

// 1. 예약 목록 조회 (GET /api/reservation)
router.get('/', reservationController.getAllReservations);

// 2. 예약 상태 변경 (PATCH /api/reservation/:id/status)
// 예: 관리자가 예약 확정/취소 버튼 누를 때 사용
router.patch('/:id/status', reservationController.updateStatus);

module.exports = router;