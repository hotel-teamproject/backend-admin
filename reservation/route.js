const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Create reservation
router.post('/', controller.create);

// List reservations (query: page, limit, status, startDate, endDate)
router.get('/', controller.list);

// Get reservation by id
router.get('/:id', controller.getById);

// Update reservation
router.put('/:id', controller.update);

// Cancel reservation
router.post('/:id/cancel', controller.cancel);

// Revenue (optional)
router.get('/stats/revenue', controller.revenue);

module.exports = router;
