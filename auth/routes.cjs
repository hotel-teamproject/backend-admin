const express = require('express');
const router = express.Router();
const controller = require('./controller.cjs');

// 🟢 [수정] 파일 확장자를 .cjs로 명확하게 지정 (에러 해결)
const { verifyToken } = require('../shared/middleware/authMiddleware.cjs'); 

router.post('/register', controller.register);
router.post('/login', controller.login);
router.all('/logout', controller.logout); 

// 내 정보 조회
router.get('/me', verifyToken, controller.me);

module.exports = router;