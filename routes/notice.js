const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// 공지사항 전체 조회
router.get('/', noticeController.getAllNotices);

// 특정 공지 조회
router.get('/:id', noticeController.getNotice);

// 공지사항 등록
router.post('/', noticeController.createNotice);

// 공지사항 수정
router.put('/:id', noticeController.updateNotice);

// 공지사항 삭제
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;
