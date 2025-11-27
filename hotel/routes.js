const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);

module.exports = router;
