const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    phone: String, // 🟢 추가
    email: String, // 🟢 추가
    rating: { type: Number, default: 0 }, // 🟢 추가
    price: { type: Number, required: true }, // 🟢 추가
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
        default: 'pending' 
    }, // 🟢 추가
    rooms: [
        { 
            roomType: { type: String, required: true },
            price: { type: Number, required: true },
            capacity: { type: Number, default: 2 },
            count: { type: Number, default: 1 }
        }
    ],
    images: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);