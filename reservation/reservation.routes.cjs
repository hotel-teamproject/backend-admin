const express = require('express');
const router = express.Router();

// 🔴 .cjs 확인! (팀 프로젝트 규칙 준수)
const reservationController = require('./reservation.controller.cjs');

// 목록 조회
router.get('/', reservationController.getAllReservations);

// 상태 변경 (PUT 방식으로 변경 - 프론트엔드와 일치)
// 💡 설명: REST API 관례상 부분 수정은 PATCH가 맞지만, 
// 현재 프론트엔드가 PUT으로 요청을 보내고 있다면 사용자(HEAD) 코드를 따라야 오류가 안 납니다.
router.put('/:id/status', reservationController.updateStatus);

module.exports = router;