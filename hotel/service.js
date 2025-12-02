const Hotel = require('../models/Hotel');

exports.createHotel = async (data) => {
    const hotel = new Hotel(data);
    return await hotel.save();
};

exports.listHotels = async () => {
    return await Hotel.find().sort({ createdAt: -1 });
};

exports.getHotelById = async (id) => {
    return await Hotel.findById(id);
};

exports.updateHotel = async (id, data) => {
    return await Hotel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteHotel = async (id) => {
    return await Hotel.findByIdAndDelete(id);
};