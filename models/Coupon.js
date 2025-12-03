const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },     // 쿠폰 이름 (예: 오픈 기념 할인)
    code: { type: String, required: true, unique: true }, // 쿠폰 코드 (예: OPEN2025)
    discount: { type: Number, required: true }, // 할인 금액 (예: 10000)
    expirationDate: { type: Date, required: true }, // 언제까지 쓸 수 있는지
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);