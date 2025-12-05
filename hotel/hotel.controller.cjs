// models 폴더에 있는 Hotel 모델을 가져옵니다.
const Hotel = require('../models/Hotel.cjs');

// 공통 응답 유틸리티 가져오기 (HEAD에서 추가된 부분)
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 1. 호텔(객실) 등록하기 (Create)
exports.createHotel = async (req, res) => {
    try {
        const newHotel = await Hotel.create(req.body);
        // create는 충돌이 없었으므로 기존 로직 유지하되, 일관성을 위해 successResponse를 적용해도 좋습니다.
        // 현재는 충돌나지 않은 원래 코드 그대로 둡니다.
        res.status(201).json({ success: true, data: newHotel });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. 전체 목록 조회하기 (Read List) - 검색, 페이지네이션 기능 유지
exports.getHotels = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // 상태 필터
        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const hotels = await Hotel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Hotel.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.json(successResponse('호텔 목록 조회 성공', {
            hotels,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (err) {
        console.error('hotel.getHotels error', err);
        return res.status(500).json(errorResponse('호텔 목록 조회 실패', err, 500));
    }
};

// 3. 특정 호텔 상세 조회 (Read One) - 상세 조회 및 에러 처리 강화 유지
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).lean();
        if (!hotel) {
            return res.status(404).json(errorResponse('호텔을 찾을 수 없습니다', null, 404));
        }
        return res.json(successResponse('호텔 조회 성공', hotel));
    } catch (err) {
        console.error('hotel.getHotelById error', err);
        return res.status(500).json(errorResponse('호텔 조회 실패', err, 500));
    }
};

// 4. 정보 수정하기 (Update) - 에러 처리 강화 유지
exports.updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // 수정된 내용을 바로 반환
        );
        if (!updatedHotel) {
            return res.status(404).json(errorResponse('호텔을 찾을 수 없습니다', null, 404));
        }
        return res.json(successResponse('호텔 수정 성공', updatedHotel));
    } catch (err) {
        console.error('hotel.updateHotel error', err);
        return res.status(500).json(errorResponse('호텔 수정 실패', err, 500));
    }
};

// 5. 삭제하기 (Delete) - 에러 처리 강화 유지
exports.deleteHotel = async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json(errorResponse('호텔을 찾을 수 없습니다', null, 404));
        }
        return res.json(successResponse('호텔 삭제 완료', null));
    } catch (err) {
        console.error('hotel.deleteHotel error', err);
        return res.status(500).json(errorResponse('호텔 삭제 실패', err, 500));
    }
};