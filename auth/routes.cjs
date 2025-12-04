const express = require('express');
const router = express.Router();

// 🔴 [수정됨] controller 파일도 .cjs로 확장자를 명시해야 합니다.
const controller = require('./controller.cjs'); 

router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;