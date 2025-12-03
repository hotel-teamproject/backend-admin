const Coupon = require('../models/Coupon'); // 방금 만든 모델 가져오기

// 1. 쿠폰 생성하기 (관리자용)
exports.createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, data: newCoupon });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. 모든 쿠폰 목록 조회
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. 쿠폰 삭제하기
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "쿠폰 삭제 완료" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};