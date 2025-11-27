const service = require('./service');
const { successResponse, errorResponse } = require('../shared/utils/response');

async function create(req, res) {
	try {
		const created = await service.createHotel(req.body);
		return res.status(201).json(successResponse('호텔 생성 성공', created, 201));
	} catch (err) {
		console.error('hotel.create error', err);
		return res.status(500).json(errorResponse('호텔 생성 실패', err, 500));
	}
}

async function list(req, res) {
	try {
		const data = await service.listHotels({ page: req.query.page, limit: req.query.limit });
		return res.json(successResponse('호텔 목록 조회 성공', data));
	} catch (err) {
		console.error('hotel.list error', err);
		return res.status(500).json(errorResponse('호텔 목록 조회 실패', err, 500));
	}
}

async function getById(req, res) {
	try {
		const item = await service.getHotelById(req.params.id);
		if (!item) return res.status(404).json(errorResponse('호텔을 찾을 수 없습니다', null, 404));
		return res.json(successResponse('호텔 조회 성공', item));
	} catch (err) {
		console.error('hotel.getById error', err);
		return res.status(500).json(errorResponse('호텔 조회 실패', err, 500));
	}
}

async function update(req, res) {
	try {
		const updated = await service.updateHotel(req.params.id, req.body);
		if (!updated) return res.status(404).json(errorResponse('호텔을 찾을 수 없습니다', null, 404));
		return res.json(successResponse('호텔 수정 성공', updated));
	} catch (err) {
		console.error('hotel.update error', err);
		return res.status(500).json(errorResponse('호텔 수정 실패', err, 500));
	}
}

module.exports = { create, list, getById, update };
