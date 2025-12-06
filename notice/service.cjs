const Notice = require('./model.cjs');

async function createNotice(payload) {
  const n = new Notice(payload);
  await n.save();
  return n.toObject();
}

async function listNotices({ page = 1, limit = 20, active } = {}) {
  const q = {};
  if (typeof active !== 'undefined') q.active = active;
  const skip = (Math.max(page, 1) - 1) * limit;
  const docs = await Notice.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
  const total = await Notice.countDocuments(q).exec();
  return { docs, total, page: Number(page), limit: Number(limit) };
}

async function getNoticeById(id) {
  return Notice.findById(id).lean().exec();
}

async function updateNotice(id, patch) {
  return Notice.findByIdAndUpdate(id, patch, { new: true }).lean().exec();
}

async function deleteNotice(id) {
  return Notice.findByIdAndDelete(id).lean().exec();
}

module.exports = { createNotice, listNotices, getNoticeById, updateNotice, deleteNotice };
