const express = require('express');
const router = express.Router();
const couponController = require('./coupon.controller');

// GET /api/coupon -> 목록 조회
router.get('/', couponController.getCoupons);

// POST /api/coupon -> 쿠폰 만들기
router.post('/', couponController.createCoupon);

// DELETE /api/coupon/:id -> 쿠폰 삭제
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;