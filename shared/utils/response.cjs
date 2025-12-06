/**
 * 표준 응답 포맷 유틸리티
 */

exports.successResponse = (message, data = null, statusCode = 200) => ({
    success: true,
    statusCode,
    message,
    data
});

exports.errorResponse = (message, error = null, statusCode = 400) => ({
    success: false,
    statusCode,
    message,
    error: error instanceof Error ? error.message : error
});
