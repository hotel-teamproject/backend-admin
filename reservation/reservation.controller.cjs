// 🔴 [수정] 팀 프로젝트 규칙에 따라 Reservation 모델을 가져옵니다. (.cjs 필수)
const Reservation = require('../models/Reservation.cjs');
// 사용자분이 만드신 응답 유틸리티 사용
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 1. 모든 예약 목록 가져오기 (고도화된 필터링/페이지네이션 기능 유지)
exports.getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status, dateFrom, dateTo } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { hotelName: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } }
            ];
        }

        // 상태 필터
        if (status) {
            query.status = status;
        }

        // 날짜 필터
        if (dateFrom) {
            query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            query.createdAt = { ...query.createdAt, $lte: toDate };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // 🔴 모델명 변경: Booking -> Reservation (팀 규칙 준수)
        const reservations = await Reservation.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Reservation.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        // 프론트엔드가 기대하는 형식으로 변환
        const formattedReservations = reservations.map((reservation, index) => ({
            id: reservation._id?.toString() || index + 1,
            hotelName: reservation.hotelName,
            userName: reservation.userName,
            userEmail: reservation.userEmail,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            guests: reservation.guests,
            amount: reservation.amount,
            status: reservation.status,
            createdAt: reservation.createdAt
        }));

        return res.json(successResponse('예약 목록 조회 성공', {
            bookings: formattedReservations, // 프론트엔드 호환성을 위해 키 값 유지
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('reservation.getAllReservations error', error);
        return res.status(500).json(errorResponse('예약 목록 조회 실패', error, 500));
    }
};

// 2. 예약 상태 변경하기
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 🔴 모델명 변경: Booking -> Reservation
        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedReservation) {
            return res.status(404).json(errorResponse('예약을 찾을 수 없습니다', null, 404));
        }

        return res.json(successResponse('예약 상태 변경 성공', updatedReservation));
    } catch (error) {
        console.error('reservation.updateStatus error', error);
        return res.status(500).json(errorResponse('상태 변경 실패', error, 500));
    }
};