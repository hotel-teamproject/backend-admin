const Coupon = require('./model.cjs');

async function createCoupon(payload) {
    const c = new Coupon(payload);
    await c.save();
    return c.toObject();
}

async function getCouponByCode(code) {
    return Coupon.findOne({ code }).lean().exec();
}

async function listCoupons({ page = 1, limit = 20 } = {}) {
    const skip = (Math.max(page, 1) - 1) * limit;
    const docs = await Coupon.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
    const total = await Coupon.countDocuments({}).exec();
    return { docs, total, page: Number(page), limit: Number(limit) };
}

async function applyCoupon(code, amount) {
    const coupon = await Coupon.findOne({ code, active: true }).exec();
    if (!coupon) throw new Error('INVALID_COUPON');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('EXPIRED');
    if (coupon.usesLimit && coupon.usedCount >= coupon.usesLimit) throw new Error('USAGE_LIMIT');

    let discount = 0;
    if (coupon.discountType === 'percent') discount = Math.round(amount * (coupon.value / 100));
    else discount = coupon.value;

    // increment usedCount
    coupon.usedCount += 1;
    await coupon.save();

    return { coupon: coupon.toObject(), discount, finalAmount: Math.max(0, amount - discount) };
}

module.exports = { createCoupon, getCouponByCode, listCoupons, applyCoupon };
