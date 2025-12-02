const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.createBooking);
router.get('/', controller.listBookings);
router.put('/:id/status', controller.updateStatus); // 상태 변경 (취소/확정)

module.exports = router;