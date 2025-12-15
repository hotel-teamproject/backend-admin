const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    
    // 할인 타입 (percent, amount 등 모두 허용)
    discountType: { type: String, required: true }, 
    
    // 할인 값 (프론트: discountValue -> DB: value)
    value: { type: Number, required: true }, 
    
    // 만료일 (프론트: endDate -> DB: expiresAt)
    expiresAt: { type: Date, required: true }, 
    
    // 사용 제한 및 상태
    usesLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);