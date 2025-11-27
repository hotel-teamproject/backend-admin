const Hotel = require('./model');

async function createHotel(payload) {
	const h = new Hotel(payload);
	await h.save();
	return h.toObject();
}

async function getHotelById(id) {
	return Hotel.findById(id).lean().exec();
}

async function listHotels({ page = 1, limit = 20 } = {}) {
	const skip = (Math.max(page, 1) - 1) * limit;
	const docs = await Hotel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
	const total = await Hotel.countDocuments({}).exec();
	return { docs, total, page: Number(page), limit: Number(limit) };
}

async function updateHotel(id, patch) {
	const updated = await Hotel.findByIdAndUpdate(id, patch, { new: true }).lean().exec();
	return updated;
}

module.exports = { createHotel, getHotelById, listHotels, updateHotel };
