const mongoose = require('mongoose');
const { Schema } = mongoose;

const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['percent', 'amount'], required: true },
    value: { type: Number, required: true },
    expiresAt: { type: Date },
    usesLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', CouponSchema);
