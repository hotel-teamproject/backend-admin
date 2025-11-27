// 간단한 미들웨어 유틸들
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
}

// 간단한 rate limiter placeholder (IP 기반, 메모리 저장)
const rateMap = new Map();
function rateLimiter({ windowMs = 60000, max = 100 } = {}) {
  return (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const entry = rateMap.get(key) || { count: 0, start: now };
      if (now - entry.start > windowMs) {
        entry.count = 1;
        entry.start = now;
      } else {
        entry.count += 1;
      }
      rateMap.set(key, entry);
      if (entry.count > max) return res.status(429).json({ success: false, message: 'Too many requests' });
      next();
    } catch (e) {
      next();
    }
  };
}

module.exports = { requestLogger, rateLimiter };
