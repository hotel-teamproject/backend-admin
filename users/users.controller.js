// 중요: '../models/User'는 models 폴더 안의 User.js를 가져오라는 뜻입니다.
const User = require('../models/User');

// 모든 회원 목록 가져오기 (요리사 역할)
exports.getAllUsers = async (req, res) => {
    try {
        // DB에서 모든 유저를 찾아서 가져옵니다.
        const users = await User.find();

        // 가져온 유저 목록을 응답으로 보냅니다.
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "회원 목록 조회 실패" });
    }
};