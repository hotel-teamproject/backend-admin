const service = require('./service');
const { successResponse, errorResponse } = require('../shared/utils/response');

async function create(req, res) {
	try {
		const item = await service.createReservation(req.body);
		return res.json(successResponse('예약 생성 성공', item));
	} catch (error) {
		console.error('reservation.create error', error);
		return res.status(500).json(errorResponse('예약 생성 실패', error, 500));
	}
}

async function getById(req, res) {
	try {
		const item = await service.getReservationById(req.params.id);
		if (!item) return res.status(404).json(errorResponse('예약을 찾을 수 없습니다', null, 404));
		return res.json(successResponse('예약 조회 성공', item));
	} catch (error) {
		console.error('reservation.getById error', error);
		return res.status(500).json(errorResponse('예약 조회 실패', error, 500));
	}
}

async function list(req, res) {
	try {
		const q = {
			page: req.query.page,
			limit: req.query.limit,
			status: req.query.status,
			startDate: req.query.startDate,
			endDate: req.query.endDate
		};
		const result = await service.listReservations(q);
		return res.json(successResponse('예약 목록 조회 성공', result));
	} catch (error) {
		console.error('reservation.list error', error);
		return res.status(500).json(errorResponse('예약 목록 조회 실패', error, 500));
	}
}

async function update(req, res) {
	try {
		const updated = await service.updateReservation(req.params.id, req.body);
		if (!updated) return res.status(404).json(errorResponse('예약을 찾을 수 없습니다', null, 404));
		return res.json(successResponse('예약 수정 성공', updated));
	} catch (error) {
		console.error('reservation.update error', error);
		return res.status(500).json(errorResponse('예약 수정 실패', error, 500));
	}
}

async function cancel(req, res) {
	try {
		const canceled = await service.cancelReservation(req.params.id);
		if (!canceled) return res.status(404).json(errorResponse('예약을 찾을 수 없습니다', null, 404));
		return res.json(successResponse('예약 취소 성공', canceled));
	} catch (error) {
		console.error('reservation.cancel error', error);
		return res.status(500).json(errorResponse('예약 취소 실패', error, 500));
	}
}

async function revenue(req, res) {
	try {
		const data = await service.revenueBetween(req.query.startDate, req.query.endDate);
		return res.json(successResponse('매출 조회 성공', data));
	} catch (error) {
		console.error('reservation.revenue error', error);
		return res.status(500).json(errorResponse('매출 조회 실패', error, 500));
	}
}

module.exports = {
	create,
	getById,
	list,
	update,
	cancel,
	revenue
};
