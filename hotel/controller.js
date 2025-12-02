const service = require('./service');

exports.create = async (req, res) => {
    try {
        const result = await service.createHotel(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.list = async (req, res) => {
    try {
        const result = await service.listHotels();
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const result = await service.getHotelById(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: "호텔 없음" });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const result = await service.updateHotel(req.params.id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await service.deleteHotel(req.params.id);
        res.status(200).json({ success: true, message: "삭제 완료" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};