const service = require('./service');

async function overview(req, res) {
  return service.getOverview(req, res);
}

async function revenueByDays(req, res) {
  return service.getRevenueByDays(req, res);
}

async function recentBookings(req, res) {
  return service.getRecentBookings(req, res);
}

module.exports = {
  overview,
  revenueByDays,
  recentBookings
};
