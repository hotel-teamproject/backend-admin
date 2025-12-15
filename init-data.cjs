require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 환경변수 또는 로컬 주소 사용
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hotel-project";

const initData = async () => {
  try {
    console.log(`📡 초기 데이터 확인 중... (${MONGO_URI})`);

    // 모델 불러오기 (실패 시 파일에서 로드)
    let User, Hotel, Review, Coupon, Reservation;
    try { User = mongoose.model("User"); } catch { User = require('./models/User.cjs'); }
    try { Hotel = mongoose.model("Hotel"); } catch { Hotel = require('./models/Hotel.cjs'); }
    try { Review = mongoose.model("Review"); } catch { Review = require('./review/review.model.cjs'); }
    try { Coupon = mongoose.model("Coupon"); } catch { Coupon = require('./coupon/model.cjs'); }
    
    // Reservation 모델
    try { 
        Reservation = mongoose.model("Reservation"); 
    } catch { 
        Reservation = require('./models/Reservation.cjs'); 
    }

    // 1. 기존 데이터 싹 비우기
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Reservation.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    console.log("🗑️ 기존 데이터 삭제 완료");

    console.log("📝 데이터 삽입 시작...");

    // 2. 유저 생성 (기존 4명 + 신규 4명 추가)
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash("hotel1234", salt);

    const createdUsers = await User.insertMany([
      // 기존 유저
      { name: "관리자", email: "hotel1@hotel.com", password: hashedPw, phone: "010-1111-2222", role: "admin", status: "active" },
      { name: "김민수", email: "minsu@example.com", password: hashedPw, phone: "010-3333-4444", role: "user", status: "active" },
      { name: "임우진", email: "woojin@example.com", password: hashedPw, phone: "010-5555-6666", role: "user", status: "active" },
      { name: "조용준", email: "yongjun@example.com", password: hashedPw, phone: "010-7777-8888", role: "user", status: "active" },
      
      // [신규] 추가된 유저 4명
      { name: "이현석", email: "hyunseok@example.com", password: hashedPw, phone: "010-1234-5678", role: "user", status: "active" },
      { name: "강승범", email: "seungbeom@example.com", password: hashedPw, phone: "010-2345-6789", role: "user", status: "active" },
      { name: "하다민", email: "damin@example.com", password: hashedPw, phone: "010-3456-7890", role: "user", status: "active" },
      { name: "김병수", email: "byeongsoo@example.com", password: hashedPw, phone: "010-4567-8901", role: "user", status: "active" },
    ]);
    
    // * 생성된 유저 변수에 담기 (ID 참조용)
    const userMinsu = createdUsers.find(u => u.name === "김민수");
    const userWoojin = createdUsers.find(u => u.name === "임우진");
    const userYongjun = createdUsers.find(u => u.name === "조용준");
    // [신규] 유저 변수 할당
    const userHyunseok = createdUsers.find(u => u.name === "이현석");
    const userSeungbeom = createdUsers.find(u => u.name === "강승범");
    const userDamin = createdUsers.find(u => u.name === "하다민");
    const userByeongsoo = createdUsers.find(u => u.name === "김병수");

    // 3. 호텔 생성 (강릉 호텔 추가)
    const createdHotels = await Hotel.insertMany([
      { name: "서울 그랜드 호텔", address: "서울 강남구", price: 150000, status: "approved", rating: 4.5 },
      { name: "부산 오션뷰", address: "부산 해운대구", price: 200000, status: "active", rating: 4.8 },
      { name: "제주 힐링 펜션", address: "제주 서귀포", price: 120000, status: "approved", rating: 4.2 },
      { name: "제주 풀빌라", address: "제주 애월", price: 100000, status: "approved", rating: 4.4 },
      // [신규] 김병수님 예약을 위한 호텔 추가
      { name: "강릉 비치 호텔", address: "강원 강릉시", price: 180000, status: "active", rating: 4.6 },
    ]);

    // * 생성된 호텔 변수에 담기
    const hotelSeoul = createdHotels.find(h => h.name === "서울 그랜드 호텔");
    const hotelBusan = createdHotels.find(h => h.name === "부산 오션뷰");
    const hotelJejuHealing = createdHotels.find(h => h.name === "제주 힐링 펜션");
    const hotelJejuPool = createdHotels.find(h => h.name === "제주 풀빌라");
    const hotelGangneung = createdHotels.find(h => h.name === "강릉 비치 호텔");

    // 4. 예약 생성
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    await Reservation.insertMany([
      // --- 기존 예약 (4건) ---
      { 
        hotelId: hotelSeoul._id,   
        userId: userMinsu._id,    
        hotelName: hotelSeoul.name,
        userName: userMinsu.name,
        checkIn: today,
        checkOut: tomorrow,
        amount: 150000,
        status: "confirmed",
        createdAt: new Date()
      },
      { 
        hotelId: hotelBusan._id,
        userId: userWoojin._id,    
        hotelName: hotelBusan.name,
        userName: userWoojin.name, 
        checkIn: tomorrow,
        checkOut: new Date(tomorrow.getTime() + 86400000),
        amount: 200000,
        status: "pending",
        createdAt: new Date()
      },
      { 
        hotelId: hotelJejuPool._id,
        userId: userYongjun._id,    
        hotelName: hotelJejuPool.name,
        userName: userYongjun.name, 
        checkIn: new Date(today.getTime() + 86400000 * 2), 
        checkOut: new Date(today.getTime() + 86400000 * 4), 
        amount: 300000,
        status: "confirmed",
        createdAt: new Date()
      },
      { 
        hotelId: hotelJejuHealing._id,
        userId: userMinsu._id,    
        hotelName: hotelJejuHealing.name,
        userName: userMinsu.name, 
        checkIn: new Date(today.getTime() + 86400000 * 5),
        checkOut: new Date(today.getTime() + 86400000 * 6), 
        amount: 120000,
        status: "cancelled",
        createdAt: new Date()
      },

      // --- [신규] 추가 요청 예약 (4건) ---
      // 1. 이현석 (대기 중)
      {
        hotelId: hotelJejuHealing._id,
        userId: userHyunseok._id,
        hotelName: hotelJejuHealing.name,
        userName: userHyunseok.name,
        checkIn: "2025-07-20",
        checkOut: "2025-07-23",
        amount: 450000,
        status: "pending", 
        createdAt: new Date("2025-06-15")
      },
      // 2. 강승범 (완료)
      {
        hotelId: hotelBusan._id,
        userId: userSeungbeom._id,
        hotelName: hotelBusan.name,
        userName: userSeungbeom.name,
        checkIn: "2025-08-15",
        checkOut: "2025-08-17",
        amount: 380000,
        status: "confirmed",
        createdAt: new Date("2025-07-01")
      },
      // 3. 하다민 (취소됨)
      {
        hotelId: hotelSeoul._id,
        userId: userDamin._id,
        hotelName: hotelSeoul.name,
        userName: userDamin.name,
        checkIn: "2025-09-10",
        checkOut: "2025-09-11",
        amount: 210000,
        status: "cancelled",
        createdAt: new Date("2025-08-20")
      },
      // 4. 김병수 (완료 - 과거 날짜)
      {
        hotelId: hotelGangneung._id,
        userId: userByeongsoo._id,
        hotelName: hotelGangneung.name,
        userName: userByeongsoo.name,
        checkIn: "2025-05-01",
        checkOut: "2025-05-05",
        amount: 850000,
        status: "completed",
        createdAt: new Date("2025-04-10")
      }
    ]);

    // 5. 기타 데이터 (쿠폰)
    await Coupon.insertMany([
        { code: "WELCOME2024", name: "웰컴 쿠폰", discountType: "percent", value: 10, expiresAt: new Date("2025-12-31") },
        { code: "SUMMER_SALE", name: "여름 할인", discountType: "amount", value: 5000, expiresAt: new Date("2024-08-31") }
    ]);

    // [중요] 리뷰 4개 추가
    await Review.insertMany([
        { 
            hotelId: hotelSeoul._id, 
            userId: userMinsu._id, 
            rating: 5, 
            content: "직원분들이 너무 친절하고 방도 깨끗해서 좋았어요! 다음에 또 올게요.", 
            hotelName: hotelSeoul.name, 
            userName: userMinsu.name,
            createdAt: new Date()
        },
        { 
            hotelId: hotelBusan._id, 
            userId: userWoojin._id, 
            rating: 4, 
            content: "바다 뷰가 정말 환상적입니다. 다만 주차장이 조금 좁네요.", 
            hotelName: hotelBusan.name, 
            userName: userWoojin.name,
            createdAt: new Date()
        },
        { 
            hotelId: hotelJejuHealing._id, 
            userId: userYongjun._id, 
            rating: 5, 
            content: "조용하게 힐링하기 딱 좋은 곳입니다. 강추합니다!", 
            hotelName: hotelJejuHealing.name, 
            userName: userYongjun.name,
            createdAt: new Date()
        },
        { 
            hotelId: hotelSeoul._id, 
            userId: userYongjun._id, 
            rating: 3, 
            content: "위치는 좋은데 방음이 조금 아쉬웠습니다.", 
            hotelName: hotelSeoul.name, 
            userName: userYongjun.name,
            createdAt: new Date()
        }
    ]);

    console.log("🎉 초기 데이터 삽입 완료! (유저 8명, 예약 8건)");

  } catch (error) {
    console.error("❌ 데이터 삽입 실패:", error);
  }
};

// 실행부
if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("✅ DB 연결 성공");
      await initData();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

module.exports = { initData };