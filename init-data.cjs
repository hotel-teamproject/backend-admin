const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB 연결 주소 (환경변수 우선, 없으면 도커/로컬 환경 기본값)
// 이전에 맞춘 DB 이름 규칙(hotel_db)을 따릅니다.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/hotel_db";

// 2. 데이터 초기화 함수 (서버에서 호출 가능하도록 export)
const initData = async () => {
  try {
    console.log("📡 초기 데이터 확인 중...");

    // [구조 유지] 기존에 정의된 모델 사용 (이미 컴파일된 모델 재사용)
    // 모델이 이미 있으면 가져오고, 없으면 require로 로드
    let User, Hotel, Review, Coupon, Booking;
    
    try { User = mongoose.model("User"); } catch { require('./models/User.cjs'); User = mongoose.model("User"); }
    try { Hotel = mongoose.model("Hotel"); } catch { require('./models/Hotel.cjs'); Hotel = mongoose.model("Hotel"); }
    try { Review = mongoose.model("Review"); } catch { require('./review/review.model.cjs'); Review = mongoose.model("Review"); }
    try { Coupon = mongoose.model("Coupon"); } catch { require('./coupon/model.cjs'); Coupon = mongoose.model("Coupon"); }
    
    // Booking 모델은 동적으로 생성 (팀 규칙 Reservation이 있다면 그것을 사용해도 되지만, 여기선 로직 유지)
    try { 
        // 팀 프로젝트에서 Reservation을 쓴다면 Reservation으로 매핑
        Booking = mongoose.model("Reservation"); 
    } catch { 
        // 없다면 기존 로직대로 Booking 생성
        if (mongoose.models.Booking) {
             Booking = mongoose.models.Booking;
        } else {
             const bookingSchema = new mongoose.Schema({}, { strict: false });
             Booking = mongoose.model("Booking", bookingSchema);
        }
    }

    // 데이터가 이미 있는지 확인
    const userCount = await User.countDocuments();
    const hotelCount = await Hotel.countDocuments();
    
    // 데이터가 이미 있으면 초기화 스킵 (중복 생성 방지)
    if (userCount > 0 && hotelCount > 0) {
      console.log("✅ 초기 데이터가 이미 존재합니다. 스킵합니다.");
      return;
    }

    console.log("📝 초기 데이터 삽입 시작...");

    // [기능 유지] 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("admin1234", salt);
    const hashedUserPassword = await bcrypt.hash("pass123", salt);

    // --- [데이터 통합] 팀 프로젝트(Upstream)의 최신 데이터 내용을 반영 ---

    // 1) 유저 데이터 (비밀번호는 해싱된 값 적용)
    const users = [
      {
        name: "관리자",
        email: "admin@hotel.com",
        password: hashedAdminPassword,
        phone: "010-0000-0000",
        role: "admin",
        status: "active",
        createdAt: new Date(),
      },
      {
        name: "김민수", // 홍길동 -> 김민수 (팀 변경사항 반영)
        email: "minsu@example.com",
        password: hashedUserPassword,
        phone: "010-1234-5678",
        role: "user",
        status: "active",
        createdAt: new Date("2023-12-01"),
      },
      {
        name: "임우진", // 김철수 -> 임우진
        email: "woojin@example.com",
        password: hashedUserPassword,
        phone: "010-2345-6789",
        role: "business",
        status: "active",
        createdAt: new Date("2023-12-15"),
      },
      {
        name: "조용준", // 이영희 -> 조용준
        email: "yongjun@example.com",
        password: hashedUserPassword,
        phone: "010-3456-7890",
        role: "user",
        status: "inactive",
        createdAt: new Date("2024-01-01"),
      },
      {
        name: "박민수",
        email: "park@example.com",
        password: hashedUserPassword,
        phone: "010-4567-8901",
        role: "user",
        status: "suspended",
        createdAt: new Date("2024-01-10"),
      },
    ];

    // 2) 호텔 데이터 (팀 데이터 반영)
    const hotels = [
      {
        name: "서울 그랜드 호텔",
        address: "서울시 강남구 테헤란로 123",
        description: "서울의 중심에서 즐기는 럭셔리한 휴식",
        rating: 4.5,
        price: 150000,
        status: "approved",
        createdAt: new Date("2024-01-15"),
      },
      {
        name: "부산 리조트",
        address: "부산시 해운대구 해운대해변로 456",
        description: "해운대 바다가 한눈에 보이는 리조트",
        rating: 4.8,
        price: 200000,
        status: "pending",
        createdAt: new Date("2024-01-20"),
      },
      {
        name: "제주 오션뷰 호텔",
        address: "제주시 연동 789",
        description: "제주의 푸른 바다를 품은 호텔",
        rating: 4.2,
        price: 180000,
        status: "active",
        createdAt: new Date("2024-01-10"),
      },
      {
        name: "경주 힐튼 호텔",
        address: "경주시 불국로 321",
        description: "천년의 역사가 살아숨쉬는 경주",
        rating: 4.7,
        price: 220000,
        status: "approved",
        createdAt: new Date("2024-01-18"),
      },
      {
        name: "인천 공항 호텔",
        address: "인천시 중구 공항로 654",
        description: "편리한 교통과 안락한 객실",
        rating: 3.9,
        price: 120000,
        status: "rejected",
        createdAt: new Date("2024-01-12"),
      },
    ];

    // 3) 예약 데이터 (팀 데이터 반영)
    const bookings = [
      {
        hotelName: "서울 그랜드 호텔",
        userName: "김민수",
        userEmail: "minsu@example.com",
        checkIn: new Date("2024-02-01"),
        checkOut: new Date("2024-02-03"),
        guests: { adults: 2, children: 1 },
        amount: 300000,
        status: "confirmed",
        createdAt: new Date("2024-01-15"),
      },
      {
        hotelName: "부산 리조트",
        userName: "임우진",
        userEmail: "woojin@example.com",
        checkIn: new Date("2024-02-05"),
        checkOut: new Date("2024-02-07"),
        guests: { adults: 2, children: 0 },
        amount: 400000,
        status: "pending",
        createdAt: new Date("2024-01-20"),
      },
      {
        hotelName: "제주 오션뷰 호텔",
        userName: "조용준",
        userEmail: "yongjun@example.com",
        checkIn: new Date("2024-01-25"),
        checkOut: new Date("2024-01-27"),
        guests: { adults: 1, children: 0 },
        amount: 360000,
        status: "completed",
        createdAt: new Date("2024-01-10"),
      },
    ];

    // 4) 리뷰 데이터 (팀 데이터 반영)
    const reviews = [
      {
        hotelName: "서울 그랜드 호텔",
        userName: "김민수",
        userEmail: "minsu@example.com",
        rating: 5,
        content: "정말 깨끗하고 서비스가 훌륭했습니다. 다음에도 또 이용하고 싶어요!",
        reported: false,
        createdAt: new Date("2024-01-20"),
      },
      {
        hotelName: "부산 리조트",
        userName: "임우진",
        userEmail: "woojin@example.com",
        rating: 4,
        content: "해변이 가까워서 좋았습니다. 다만 조식이 좀 아쉬웠어요.",
        reported: false,
        createdAt: new Date("2024-01-18"),
      },
      {
        hotelName: "제주 오션뷰 호텔",
        userName: "조용준",
        userEmail: "yongjun@example.com",
        rating: 3,
        content: "시설은 괜찮은데 직원 서비스가 별로였습니다.",
        reported: true,
        createdAt: new Date("2024-01-15"),
      },
    ];

    // 5) 쿠폰 데이터 (팀 데이터 반영)
    const coupons = [
      {
        code: "WELCOME2024",
        name: "신규 가입 환영 쿠폰",
        discountType: "percentage",
        value: 10, // 팀 데이터에서 이름 매핑 필요 (discountValue -> value)
        expiresAt: new Date("2024-12-31"), // endDate -> expiresAt
        usesLimit: 1000, // usageLimit -> usesLimit
        usedCount: 245,
        active: true,
        createdAt: new Date("2023-12-20"),
      },
      {
        code: "SUMMER50000",
        name: "여름 특가 쿠폰",
        discountType: "fixed", // amount -> fixed
        value: 50000,
        expiresAt: new Date("2024-08-31"),
        usesLimit: 500,
        usedCount: 500,
        active: true,
        createdAt: new Date("2024-05-15"),
      },
    ];

    // --- [데이터 처리 시작] ---

    console.log("  → 회원 데이터 삽입 중...");
    const insertedUsers = await User.insertMany(users);
    console.log(`  ✅ 회원 ${insertedUsers.length}개 삽입 완료`);

    console.log("  → 호텔 데이터 삽입 중...");
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`  ✅ 호텔 ${insertedHotels.length}개 삽입 완료`);

    console.log("  → 예약 데이터 삽입 중...");
    const insertedBookings = await Booking.insertMany(bookings);
    console.log(`  ✅ 예약 ${insertedBookings.length}개 삽입 완료`);

    console.log("  → 리뷰 데이터 삽입 중...");
    const insertedReviews = await Review.insertMany(reviews);
    console.log(`  ✅ 리뷰 ${insertedReviews.length}개 삽입 완료`);

    console.log("  → 쿠폰 데이터 삽입 중...");
    const insertedCoupons = await Coupon.insertMany(coupons);
    console.log(`  ✅ 쿠폰 ${insertedCoupons.length}개 삽입 완료`);

    console.log("🎉 초기 데이터 삽입 완료!");
    
  } catch (error) {
    console.error("❌ 초기 데이터 삽입 실패:", error.message);
    // 에러가 나도 서버는 계속 실행되도록 함
  }
};

// 직접 실행 시 (node init-data.cjs) - 테스트용
if (require.main === module) {
  (async () => {
    try {
      console.log("📡 MongoDB 연결 중...");
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB 연결 성공!");
      
      // 직접 실행 시에는 스키마 로드 로직이 필요할 수 있음 (생략 가능)
      
      await initData();
      process.exit(0);
    } catch (error) {
      console.error("❌ 데이터 초기화 실패:", error);
      process.exit(1);
    }
  })();
}

// 서버에서 호출 시 export
module.exports = { initData };