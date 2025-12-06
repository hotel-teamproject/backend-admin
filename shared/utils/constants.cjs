/**
 * 애플리케이션 전역 상수
 */

exports.USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator'
};

exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500
};

exports.MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: '로그인 성공',
        LOGOUT_SUCCESS: '로그아웃 완료',
        REGISTER_SUCCESS: '가입 성공',
        TOKEN_EXPIRED: '토큰이 만료되었습니다',
        UNAUTHORIZED: '인증이 필요합니다',
        FORBIDDEN: '권한이 없습니다'
    },
    VALIDATION: {
        INVALID_INPUT: '유효하지 않은 입력값입니다',
        EMAIL_ALREADY_EXISTS: '이미 가입된 이메일입니다',
        PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다'
    },
    NOT_FOUND: '요청하신 리소스를 찾을 수 없습니다',
    SERVER_ERROR: '서버 오류가 발생했습니다'
};
