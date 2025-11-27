// auth/controller.js
const authService = require('./service');
const { sendSuccess } = require('../shared/utils/response'); // 파일 이름 다르면 맞게 수정

// 회원가입
async function register(req, res, next) {
    try {
        const result = await authService.register(req.body);
        // 표준 응답 유틸이 있으면 사용
        if (sendSuccess) {
            return sendSuccess(res, 201, '회원가입이 완료되었습니다.', result);
        }
        // 없으면 직접 응답
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: '회원가입이 완료되었습니다.',
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

// 로그인
async function login(req, res, next) {
    try {
        const result = await authService.login(req.body);
        if (sendSuccess) {
            return sendSuccess(res, 200, '로그인에 성공했습니다.', result);
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: '로그인에 성공했습니다.',
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

// 로그아웃 (토큰 무효화 방식에 따라 구현)
async function logout(req, res, next) {
    try {
        await authService.logout(req.user);
        if (sendSuccess) {
            return sendSuccess(res, 200, '로그아웃되었습니다.');
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: '로그아웃되었습니다.',
            data: null,
        });
    } catch (err) {
        next(err);
    }
}

// 프로필 조회
async function profile(req, res, next) {
    try {
        const result = await authService.getProfile(req.user);
        if (sendSuccess) {
            return sendSuccess(res, 200, '프로필 조회에 성공했습니다.', result);
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: '프로필 조회에 성공했습니다.',
            data: result,
        });
    } catch (err) {
        next(err);
    }
}

// 비밀번호 변경
async function changePassword(req, res, next) {
    try {
        await authService.changePassword(req.user, req.body);
        if (sendSuccess) {
            return sendSuccess(res, 200, '비밀번호가 변경되었습니다.');
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: '비밀번호가 변경되었습니다.',
            data: null,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    logout,
    profile,
    changePassword,
};
