const { errorResponse } = require('../utils/response');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

/**
 * 전역 에러 핸들러 미들웨어
 */
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // 기본 에러 상태 코드와 메시지 설정
    let statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
    let message = err.message || MESSAGES.SERVER_ERROR;

    // MongoDB 검증 에러
    if (err.name === 'ValidationError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ');
    }

    // MongoDB 중복 에러
    if (err.code === 11000) {
        statusCode = HTTP_STATUS.CONFLICT;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field}이(가) 이미 존재합니다`;
    }

    // JWT 에러
    if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = '유효하지 않은 토큰입니다';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = '토큰이 만료되었습니다';
    }

    res.status(statusCode).json(
        errorResponse(message, err.details || null, statusCode)
    );
};

/**
 * 404 처리 미들웨어
 */
exports.notFoundHandler = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json(
        errorResponse(MESSAGES.NOT_FOUND, null, HTTP_STATUS.NOT_FOUND)
    );
};
