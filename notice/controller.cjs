const service = require('./service.cjs');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

async function create(req, res) {
  try {
    const created = await service.createNotice(req.body);
    return res.status(201).json(successResponse('공지 생성 성공', created, 201));
  } catch (err) {
    console.error('notice.create error', err);
    return res.status(500).json(errorResponse('공지 생성 실패', err, 500));
  }
}

async function list(req, res) {
  try {
    const data = await service.listNotices({ page: req.query.page, limit: req.query.limit, active: req.query.active });
    return res.json(successResponse('공지 목록 조회 성공', data));
  } catch (err) {
    console.error('notice.list error', err);
    return res.status(500).json(errorResponse('공지 목록 조회 실패', err, 500));
  }
}

async function getById(req, res) {
  try {
    const item = await service.getNoticeById(req.params.id);
    if (!item) return res.status(404).json(errorResponse('공지 없음', null, 404));
    return res.json(successResponse('공지 조회 성공', item));
  } catch (err) {
    console.error('notice.getById error', err);
    return res.status(500).json(errorResponse('공지 조회 실패', err, 500));
  }
}

async function update(req, res) {
  try {
    const updated = await service.updateNotice(req.params.id, req.body);
    return res.json(successResponse('공지 수정 성공', updated));
  } catch (err) {
    console.error('notice.update error', err);
    return res.status(500).json(errorResponse('공지 수정 실패', err, 500));
  }
}

async function remove(req, res) {
  try {
    await service.deleteNotice(req.params.id);
    return res.json(successResponse('공지 삭제 성공', null));
  } catch (err) {
    console.error('notice.delete error', err);
    return res.status(500).json(errorResponse('공지 삭제 실패', err, 500));
  }
}

module.exports = { create, list, getById, update, remove };

