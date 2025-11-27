const mongoose = require('mongoose');

function listModels() {
  try {
    return mongoose.modelNames();
  } catch (e) {
    return [];
  }
}

module.exports = { listModels };
