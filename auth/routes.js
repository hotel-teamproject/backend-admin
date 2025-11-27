const express = require('express');
const authController = require('./controller');
const { verifyToken } = require('../shared/middleware/authMiddleware');

const router = express.Router();

/**
 * 인증 라우트
 */

// 인증 필요 없음
router.post('/login', authController.login);
router.post('/register', authController.register);

// 인증 필요
router.post('/logout', verifyToken, authController.logout);
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router;
