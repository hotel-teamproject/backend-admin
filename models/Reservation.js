const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roomType: String,
    guestName: String,
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: Number,
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);