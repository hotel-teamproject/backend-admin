// routes/reservations.js
router.get('/', reservationsController.getReservations);             // 목록/필터
router.post('/', reservationsController.createReservation);          // 예약 생성
router.put('/:id', reservationsController.updateReservation);        // 예약 변경
router.delete('/:id', reservationsController.cancelReservation);     // 예약 취소
