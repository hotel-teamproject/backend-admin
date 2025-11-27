const { successResponse } = require('../shared/utils/response');

function health(req, res) {
  return res.json(successResponse('middlewares OK', { time: new Date().toISOString() }));
}

module.exports = { health };
