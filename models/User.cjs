const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: String, // 🟢 추가
    role: { 
        type: String, 
        enum: ['user', 'admin', 'business'], 
        default: 'user' 
    },
    status: { type: String, default: 'active' } // 🟢 추가
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);