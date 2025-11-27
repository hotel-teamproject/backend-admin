const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyToken } = require('../shared/middleware/authMiddleware');

// Public
router.post('/register', controller.register);
router.post('/login', controller.login);

// Protected
router.post('/logout', verifyToken, controller.logout);
router.get('/profile', verifyToken, controller.profile);
router.post('/change-password', verifyToken, controller.changePassword);

module.exports = router;
