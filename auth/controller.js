const authService = require('./service');
const { successResponse, errorResponse } = require('../shared/utils/response');
const { HTTP_STATUS, MESSAGES } = require('../shared/utils/constants');

/**
 * 로그인 컨트롤러
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 입력 값 검증
        if (!email || !password) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json(
                    errorResponse(
                        MESSAGES.VALIDATION.INVALID_INPUT,
                        null,
                        HTTP_STATUS.BAD_REQUEST
                    )
                );
        }

        const result = await authService.login(email, password);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        });

        res.json(
            successResponse(MESSAGES.AUTH.LOGIN_SUCCESS, result, HTTP_STATUS.OK)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * 회원가입 컨트롤러
 */
exports.register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // 입력 값 검증
        if (!email || !password || !name) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json(
                    errorResponse(
                        MESSAGES.VALIDATION.INVALID_INPUT,
                        null,
                        HTTP_STATUS.BAD_REQUEST
                    )
                );
        }

        const result = await authService.register(email, password, name);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res
            .status(HTTP_STATUS.CREATED)
            .json(
                successResponse(
                    MESSAGES.AUTH.REGISTER_SUCCESS,
                    result,
                    HTTP_STATUS.CREATED
                )
            );
    } catch (error) {
        next(error);
    }
};

/**
 * 로그아웃 컨트롤러
 */
exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.json(
            successResponse(MESSAGES.AUTH.LOGOUT_SUCCESS, null, HTTP_STATUS.OK)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * 프로필 조회 컨트롤러
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.userId);
        res.json(successResponse('프로필 조회 성공', user, HTTP_STATUS.OK));
    } catch (error) {
        next(error);
    }
};

/**
 * 프로필 수정 컨트롤러
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, avatar } = req.body;
        const user = await authService.updateProfile(req.userId, { name, avatar });
        res.json(successResponse('프로필 수정 완료', user, HTTP_STATUS.OK));
    } catch (error) {
        next(error);
    }
};

/**
 * 비밀번호 변경 컨트롤러
 */
exports.changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(HTTP_STATUS.BAD_REQUEST)
                .json(
                    errorResponse(
                        MESSAGES.VALIDATION.INVALID_INPUT,
                        null,
                        HTTP_STATUS.BAD_REQUEST
                    )
                );
        }

        const result = await authService.changePassword(
            req.userId,
            oldPassword,
            newPassword
        );

        res.json(successResponse(result.message, null, HTTP_STATUS.OK));
    } catch (error) {
        next(error);
    }
};
