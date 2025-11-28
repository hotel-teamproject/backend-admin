const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./model');
const { errorResponse, successResponse } = require('../shared/utils/response');
const { MESSAGES } = require('../shared/utils/constants');

/**
 * 로그인 서비스
 */
exports.login = async (email, password) => {
    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            const error = new Error(MESSAGES.VALIDATION.PASSWORD_MISMATCH);
            error.statusCode = 401;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            const error = new Error(MESSAGES.VALIDATION.PASSWORD_MISMATCH);
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar
            }
        };
    } catch (error) {
        throw error;
    }
};

/**
 * 회원가입 서비스
 */
exports.register = async (email, password, name) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error(MESSAGES.VALIDATION.EMAIL_ALREADY_EXISTS);
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        };
    } catch (error) {
        throw error;
    }
};

/**
 * 프로필 조회 서비스
 */
exports.getProfile = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error(MESSAGES.NOT_FOUND);
            error.statusCode = 404;
            throw error;
        }
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * 프로필 수정 서비스
 */
exports.updateProfile = async (userId, updateData) => {
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            const error = new Error(MESSAGES.NOT_FOUND);
            error.statusCode = 404;
            throw error;
        }
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * 비밀번호 변경 서비스
 */
exports.changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            const error = new Error(MESSAGES.NOT_FOUND);
            error.statusCode = 404;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            const error = new Error('비밀번호가 일치하지 않습니다');
            error.statusCode = 401;
            throw error;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return { message: '비밀번호가 변경되었습니다' };
    } catch (error) {
        throw error;
    }
};
