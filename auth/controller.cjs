const User = require('../models/User.cjs'); // ⬅️ .cjs 확인!
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. 회원가입
exports.register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'user',
        });

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. 로그인
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret1234',
            { expiresIn: '1d' }
        );

        // 쿠키에도 토큰 저장 (httpOnly로 보안 강화) - 사용자 작업분 유지
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1일
        });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. 로그아웃 - 사용자 작업분 유지
exports.logout = async (req, res) => {
    try {
        // 쿠키 삭제
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        
        res.status(200).json({ 
            success: true, 
            message: '로그아웃 되었습니다.' 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};