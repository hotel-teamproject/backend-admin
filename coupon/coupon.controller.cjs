const Coupon = require('../models/Coupon.cjs');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 1. 쿠폰 생성하기
exports.createCoupon = async (req, res) => {
    try {
        // 프론트엔드에서 오는 데이터 이름들
        const { code, name, discountType, discountValue, endDate, usageLimit, isActive } = req.body;

        // DB 모델 이름에 맞춰서 변환 (매핑)
        const newCoupon = await Coupon.create({
            code,
            name,
            // 프론트(percentage/fixed) -> DB(percent/amount) 로 변환하거나 그대로 저장
            discountType: discountType === 'fixed' ? 'amount' : 'percent', 
            value: discountValue,      // discountValue -> value
            expiresAt: endDate,        // endDate -> expiresAt
            usesLimit: usageLimit,     // usageLimit -> usesLimit
            active: isActive           // isActive -> active
        });

        return res.status(201).json(successResponse('쿠폰 생성 성공', newCoupon, 201));
    } catch (error) {
        console.error('coupon.createCoupon error', error);
        return res.status(500).json(errorResponse('쿠폰 생성 실패', error, 500));
    }
};

// ... (getCoupons, deleteCoupon 등 나머지 함수는 그대로 유지)
exports.getCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = {};
        if (search) query.code = { $regex: search, $options: 'i' };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();
            
        const total = await Coupon.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.json(successResponse('쿠폰 목록 조회 성공', {
            coupons,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        return res.status(500).json(errorResponse('쿠폰 목록 조회 실패', error));
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        return res.json(successResponse('쿠폰 삭제 완료', null));
    } catch (error) {
        return res.status(500).json(errorResponse('쿠폰 삭제 실패', error));
    }
};