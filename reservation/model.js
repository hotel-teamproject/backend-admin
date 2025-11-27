const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReservationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: false },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: false },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  nights: { type: Number, default: 1 },
  pricePerNight: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ReservationSchema.pre('save', function (next) {
  if (this.checkIn && this.checkOut) {
    const diff = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
    this.nights = diff > 0 ? diff : 1;
  }

  if (this.pricePerNight && !this.totalPrice) {
    this.totalPrice = this.pricePerNight * (this.nights || 1);
  }

  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Reservation', ReservationSchema);
