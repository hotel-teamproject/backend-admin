const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

router.patch('/:id/status', roomsController.updateStatus);

module.exports = router;
