// 중요: '../models/User'는 models 폴더 안의 User.js를 가져오라는 뜻입니다.
const User = require('../models/User.cjs');

// 사용자분(HEAD)이 만드신 유틸리티와 고급 로직을 유지합니다.
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 모든 회원 목록 가져오기 (검색, 필터, 페이징 기능 포함)
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, role, status } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // 역할 필터
        if (role) {
            query.role = role;
        }

        // 상태 필터
        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await User.find(query)
            .select('-password') // 🔐 보안: 비밀번호 필드는 제외하고 가져옵니다.
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.json(successResponse('회원 목록 조회 성공', {
            users,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('users.getAllUsers error', error);
        return res.status(500).json(errorResponse('회원 목록 조회 실패', error, 500));
    }
};