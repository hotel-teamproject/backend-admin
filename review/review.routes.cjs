const express = require('express');
const router = express.Router();
const controller = require('./review.controller.cjs');

router.get('/', controller.getReviews);
router.get('/reported', controller.getReportedReviews);
router.get('/:id', controller.getReviewById);
router.delete('/:id', controller.deleteReview);
router.post('/:id/report', controller.handleReport);

module.exports = router;

