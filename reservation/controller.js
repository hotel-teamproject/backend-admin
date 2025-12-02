const service = require('./service');

exports.createBooking = async (req, res) => {
    try {
        const result = await service.createReservation(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.listBookings = async (req, res) => {
    try {
        const result = await service.listReservations();
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        // req.body.status로 상태값(confirmed 등)을 받음
        const result = await service.updateStatus(req.params.id, req.body.status);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};