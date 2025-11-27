const service = require('./service');
const { successResponse } = require('../shared/utils/response');

function index(req, res) {
  const names = service.listModels();
  return res.json(successResponse('models listed', names));
}

module.exports = { index };
