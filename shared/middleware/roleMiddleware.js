const { errorResponse } = require('../utils/response');
const { HTTP_STATUS, MESSAGES, USER_ROLES } = require('../utils/constants');

/**
 * 역할 기반 접근 제어 미들웨어
 * @param {...string} allowedRoles - 허용된 역할 목록
 */
exports.requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(
                errorResponse(MESSAGES.AUTH.UNAUTHORIZED, null, HTTP_STATUS.UNAUTHORIZED)
            );
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                errorResponse(MESSAGES.AUTH.FORBIDDEN, null, HTTP_STATUS.FORBIDDEN)
            );
        }

        next();
    };
};

/**
 * 관리자 권한 확인 미들웨어
 */
exports.requireAdmin = exports.requireRole(USER_ROLES.ADMIN);

/**
 * 관리자 또는 모더레이터 권한 확인 미들웨어
 */
exports.requireAdminOrMod = exports.requireRole(USER_ROLES.ADMIN, USER_ROLES.MODERATOR);
