const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
  number: { type: String },
  type: { type: String },
  pricePerNight: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
});

const HotelSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  totalRooms: { type: Number, default: 0 },
  rooms: [RoomSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', HotelSchema);
