// models 폴더에 있는 Hotel 모델을 가져옵니다.
const Hotel = require('../models/Hotel');

// 1. 호텔(객실) 등록하기 (Create)
exports.createHotel = async (req, res) => {
    try {
        const newHotel = await Hotel.create(req.body);
        res.status(201).json({ success: true, data: newHotel });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. 전체 목록 조회하기 (Read List)
exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ success: true, data: hotels });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. 특정 호텔 상세 조회 (Read One)
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: "찾을 수 없습니다." });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. 정보 수정하기 (Update)
exports.updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // 수정된 내용을 바로 반환
        );
        res.status(200).json({ success: true, data: updatedHotel });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 5. 삭제하기 (Delete)
exports.deleteHotel = async (req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "삭제 완료" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};