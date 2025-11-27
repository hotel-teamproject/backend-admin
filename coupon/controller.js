const service = require('./service');
const { successResponse, errorResponse } = require('../shared/utils/response');

async function create(req, res) {
    try {
        const created = await service.createCoupon(req.body);
        return res.status(201).json(successResponse('쿠폰 생성 성공', created, 201));
    } catch (err) {
        console.error('coupon.create error', err);
        return res.status(500).json(errorResponse('쿠폰 생성 실패', err, 500));
    }
}

async function list(req, res) {
    try {
        const data = await service.listCoupons({ page: req.query.page, limit: req.query.limit });
        return res.json(successResponse('쿠폰 목록 조회 성공', data));
    } catch (err) {
        console.error('coupon.list error', err);
        return res.status(500).json(errorResponse('쿠폰 목록 조회 실패', err, 500));
    }
}

async function apply(req, res) {
    try {
        const { code, amount } = req.body;
        const result = await service.applyCoupon(code, amount);
        return res.json(successResponse('쿠폰 적용 성공', result));
    } catch (err) {
        console.error('coupon.apply error', err);
        return res.status(400).json(errorResponse('쿠폰 적용 실패', err, 400));
    }
}

module.exports = { create, list, apply };
