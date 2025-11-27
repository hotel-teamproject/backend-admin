const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyToken } = require('../shared/middleware/authMiddleware');

router.post('/', verifyToken, controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', verifyToken, controller.update);
router.delete('/:id', verifyToken, controller.remove);

module.exports = router;
