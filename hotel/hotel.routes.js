const express = require('express');
const router = express.Router();
// 방금 작성한 컨트롤러 파일 연결
const hotelController = require('./hotel.controller');

// 기본 주소: /api/hotel

router.post('/', hotelController.createHotel);       // 등록
router.get('/', hotelController.getHotels);          // 전체 조회
router.get('/:id', hotelController.getHotelById);    // 상세 조회
router.put('/:id', hotelController.updateHotel);     // 수정
router.delete('/:id', hotelController.deleteHotel);  // 삭제

module.exports = router;