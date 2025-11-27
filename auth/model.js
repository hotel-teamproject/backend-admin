const mongoose = require('mongoose');

/**
 * User 스키마 (인증 도메인)
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, '이메일은 필수입니다'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력하세요']
    },
    password: {
        type: String,
        required: [true, '비밀번호는 필수입니다'],
        minlength: 6,
        select: false // 기본적으로 조회 시 제외
    },
    name: {
        type: String,
        required: [true, '이름은 필수입니다']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    avatar: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 업데이트 시 updatedAt 자동 갱신
userSchema.pre('findByIdAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

module.exports = mongoose.model('User', userSchema);
