const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');

// 주소: / (즉, /api/users 로 들어왔을 때)
router.get('/', usersController.getAllUsers);

module.exports = router;