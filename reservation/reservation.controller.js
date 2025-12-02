const Reservation = require('../models/Reservation');

// 1. 모든 예약 목록 가져오기
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "예약 목록 조회 실패" });
    }
};

// 2. 예약 상태 변경하기 (나중에 쓸 기능 미리 추가)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;   // 주소에 있는 id
        const { status } = req.body; // 보낼 데이터 (예: 'confirmed')

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // 업데이트된 내용을 바로 반환
        );

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: "상태 변경 실패" });
    }
};