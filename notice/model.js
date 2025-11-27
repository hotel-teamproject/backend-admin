const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoticeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetRoles: { type: [String], default: [] },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);
