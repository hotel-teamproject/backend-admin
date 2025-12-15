const service = require('./service.cjs');

async function overview(req, res, next) { // 🟢 next 추가
  try {
    return await service.getOverview(req, res);
  } catch (error) {
    next(error); // 🟢 에러 핸들러로 위임
  }
}

async function revenueByDays(req, res, next) { // 🟢 next 추가
  try {
    return await service.getRevenueByDays(req, res);
  } catch (error) {
    next(error);
  }
}

async function recentBookings(req, res, next) { // 🟢 next 추가
  try {
    return await service.getRecentBookings(req, res);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  overview,
  revenueByDays,
  recentBookings
};