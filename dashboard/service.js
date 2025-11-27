const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../shared/utils/response');

function getCollection(name) {
  try {
    return mongoose.model(name);
  } catch (e) {
    // 모델이 등록되어 있지 않으면 저수준 컬렉션 접근
    const conn = mongoose.connection;
    if (!conn) throw new Error('MongoDB 연결이 필요합니다');
    return conn.collection(name.toLowerCase() + 's');
  }
}

async function getOverview(req, res) {
  const Reservation = getCollection('Reservation');

  // Reservation이 mongoose Model인지 여부 확인
  const isNative = typeof Reservation.aggregate === 'function' && Reservation.collection;

  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalReservations: { $sum: 1 },
          totalRevenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
        }
      }
    ];

    let result;
    if (isNative) {
      result = await Reservation.aggregate(pipeline).exec();
    } else {
      result = await Reservation.aggregate(pipeline).toArray();
    }

    const stats = (result && result[0]) || { totalReservations: 0, totalRevenue: 0 };

    return res.json(successResponse('대시보드 개요 조회 성공', {
      totalReservations: stats.totalReservations || 0,
      totalRevenue: stats.totalRevenue || 0
    }));
  } catch (error) {
    console.error('dashboard.service.getOverview error', error);
    return res.status(500).json(errorResponse('대시보드 개요 조회 실패', error, 500));
  }
}

// 일별 매출(최근 N일)
async function getRevenueByDays(req, res) {
  const days = Math.min(parseInt(req.query.days || '7', 10), 90);
  const Reservation = getCollection('Reservation');
  const isNative = typeof Reservation.aggregate === 'function' && Reservation.collection;

  try {
    const start = new Date();
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - (days - 1));

    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: { $ifNull: ["$totalPrice", 0] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    let rows;
    if (isNative) rows = await Reservation.aggregate(pipeline).exec();
    else rows = await Reservation.aggregate(pipeline).toArray();

    // 채우기: 빈 날짜도 0으로 채운다
    const map = {};
    rows.forEach(r => { map[r._id] = { revenue: r.revenue, count: r.count } });

    const out = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0,10);
      out.push({ date: key, revenue: (map[key] && map[key].revenue) || 0, count: (map[key] && map[key].count) || 0 });
    }

    return res.json(successResponse('일별 매출 조회 성공', out));
  } catch (error) {
    console.error('dashboard.service.getRevenueByDays error', error);
    return res.status(500).json(errorResponse('매출 조회 실패', error, 500));
  }
}

// 최근 예약들
async function getRecentBookings(req, res) {
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const Reservation = getCollection('Reservation');
  const isNative = typeof Reservation.find === 'function' && Reservation.collection;

  try {
    let docs;
    if (isNative) {
      docs = await Reservation.find({}).sort({ createdAt: -1 }).limit(limit).lean().exec();
    } else {
      docs = await Reservation.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
    }

    return res.json(successResponse('최근 예약 조회 성공', docs));
  } catch (error) {
    console.error('dashboard.service.getRecentBookings error', error);
    return res.status(500).json(errorResponse('최근 예약 조회 실패', error, 500));
  }
}

module.exports = {
  getOverview,
  getRevenueByDays,
  getRecentBookings
};
