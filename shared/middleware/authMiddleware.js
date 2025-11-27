const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

/**
 * JWT 토큰 검증 미들웨어
 */
exports.verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                errorResponse(MESSAGES.AUTH.UNAUTHORIZED, null, HTTP_STATUS.UNAUTHORIZED)
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
            errorResponse(MESSAGES.AUTH.TOKEN_EXPIRED, error.message, HTTP_STATUS.UNAUTHORIZED)
        );
    }
};

/**
 * 토큰 리프레시 미들웨어 (선택사항)
 */
exports.refreshToken = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new Error('Refresh token not found');
        
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.cookie('token', newToken, { httpOnly: true });
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
            errorResponse(MESSAGES.AUTH.TOKEN_EXPIRED, error.message, HTTP_STATUS.UNAUTHORIZED)
        );
    }
};
