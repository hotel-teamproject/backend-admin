const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.create);       // 호텔 등록
router.get('/', controller.list);          // 목록 조회
router.get('/:id', controller.getById);    // 상세 조회
router.put('/:id', controller.update);     // 수정
router.delete('/:id', controller.remove);  // 삭제

module.exports = router;