const Reservation = require('./model');
const mongoose = require('mongoose');

async function createReservation(payload) {
	const r = new Reservation(payload);
	await r.save();
	return r.toObject();
}

async function getReservationById(id) {
	if (!mongoose.Types.ObjectId.isValid(id)) return null;
	return Reservation.findById(id).lean().exec();
}

async function listReservations({ page = 1, limit = 20, status, startDate, endDate } = {}) {
	const q = {};
	if (status) q.status = status;
	if (startDate || endDate) q.createdAt = {};
	if (startDate) q.createdAt.$gte = new Date(startDate);
	if (endDate) q.createdAt.$lte = new Date(endDate);

	const skip = (Math.max(page, 1) - 1) * limit;
	const docs = await Reservation.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
	const total = await Reservation.countDocuments(q).exec();
	return { docs, total, page: Number(page), limit: Number(limit) };
}

async function updateReservation(id, patch) {
	if (!mongoose.Types.ObjectId.isValid(id)) return null;
	patch.updatedAt = new Date();
	const updated = await Reservation.findByIdAndUpdate(id, patch, { new: true }).lean().exec();
	return updated;
}

async function cancelReservation(id) {
	return updateReservation(id, { status: 'cancelled' });
}

async function revenueBetween(start, end) {
	const match = {};
	if (start) match.createdAt = { $gte: new Date(start) };
	if (end) match.createdAt = match.createdAt ? { ...match.createdAt, $lte: new Date(end) } : { $lte: new Date(end) };

	const pipeline = [
		{ $match: match },
		{ $group: { _id: null, revenue: { $sum: { $ifNull: ['$totalPrice', 0] } }, count: { $sum: 1 } } }
	];
	const res = await Reservation.aggregate(pipeline).exec();
	return (res && res[0]) ? { revenue: res[0].revenue, count: res[0].count } : { revenue: 0, count: 0 };
}

module.exports = {
	createReservation,
	getReservationById,
	listReservations,
	updateReservation,
	cancelReservation,
	revenueBetween
};

