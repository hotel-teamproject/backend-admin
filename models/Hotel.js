const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    // 객실 정보 배열
    rooms: [
        { 
            roomType: { type: String, required: true }, // 예: Standard, Deluxe
            price: { type: Number, required: true },
            capacity: { type: Number, default: 2 },
            count: { type: Number, default: 1 } // 보유 객실 수
        }
    ],
    images: [String], // 이미지 URL들
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);