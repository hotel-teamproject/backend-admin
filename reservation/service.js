const Reservation = require('../models/Reservation');

exports.createReservation = async (data) => {
    const reservation = new Reservation(data);
    return await reservation.save();
};

exports.listReservations = async () => {
    // populate를 쓰면 호텔 정보와 유저 정보를 같이 가져옵니다.
    return await Reservation.find()
        .populate('hotelId', 'name')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
};

exports.updateStatus = async (id, status) => {
    return await Reservation.findByIdAndUpdate(id, { status }, { new: true });
};