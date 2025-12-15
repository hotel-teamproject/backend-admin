const User = require('../models/User.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. 회원가입
exports.register = async (req, res, next) => {
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
        next(error);
    }
};

// 2. 로그인
exports.login = async (req, res, next) => {
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

        // 쿠키에도 토큰 저장 (httpOnly로 보안 강화)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/', // 🟢 [중요] 모든 경로에서 쿠키 유효
            maxAge: 24 * 60 * 60 * 1000 // 1일
        });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

// 3. 로그아웃
exports.logout = async (req, res, next) => {
    try {
        // 쿠키 삭제
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/' // 🟢 [중요] 로그인과 동일한 경로
        });
        
        res.status(200).json({ 
            success: true, 
            message: '로그아웃 되었습니다.' 
        });
    } catch (error) {
        next(error);
    }
};

// 4. 내 정보 조회 (로그인 유지용) 🟢 [추가됨]
exports.me = async (req, res, next) => {
    try {
        // verifyToken 미들웨어가 req.userId를 심어줍니다.
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};