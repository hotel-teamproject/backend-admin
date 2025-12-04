const mongoose = require("mongoose");

// 1. MongoDB 연결 설정
const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://root:pass123@localhost:27017/hotel-project?authSource=admin";

// 2. 데이터 스키마 정의
const userSchema = new mongoose.Schema({}, { strict: false });
const hotelSchema = new mongoose.Schema({}, { strict: false });
const bookingSchema = new mongoose.Schema({}, { strict: false });
const reviewSchema = new mongoose.Schema({}, { strict: false });
const couponSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model("User", userSchema);
const Hotel = mongoose.model("Hotel", hotelSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Review = mongoose.model("Review", reviewSchema);
const Coupon = mongoose.model("Coupon", couponSchema);

// 3. 초기 데이터
const mockAdminUser = {
    name: "관리자",
    email: "admin@hotel.com",
    password: "admin1234",
    phone: "010-0000-0000",
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
};

// [수정됨] 이름 변경 반영 (홍길동->김민수, 김철수->임우진, 이영희->조용준)
const users = [
    mockAdminUser,
    {
        name: "김민수", // 홍길동 -> 김민수
        email: "minsu@example.com", // 이메일도 이름에 맞춰 수정 (선택사항)
        password: "pass123",
        phone: "010-1234-5678",
        role: "user",
        status: "active",
        createdAt: new Date("2023-12-01").toISOString(),
    },
    {
        name: "임우진", // 김철수 -> 임우진
        email: "woojin@example.com",
        password: "pass123",
        phone: "010-2345-6789",
        role: "business",
        status: "active",
        createdAt: new Date("2023-12-15").toISOString(),
    },
    {
        name: "조용준", // 이영희 -> 조용준
        email: "yongjun@example.com",
        password: "pass123",
        phone: "010-3456-7890",
        role: "user",
        status: "inactive",
        createdAt: new Date("2024-01-01").toISOString(),
    },
    {
        name: "박민수", // 유지
        email: "park@example.com",
        password: "pass123",
        phone: "010-4567-8901",
        role: "user",
        status: "suspended",
        createdAt: new Date("2024-01-10").toISOString(),
    },
];

const hotels = [
    {
        name: "서울 그랜드 호텔",
        address: "서울시 강남구 테헤란로 123",
        description: "서울의 중심에서 즐기는 럭셔리한 휴식",
        rating: 4.5,
        price: 150000,
        status: "approved",
        createdAt: new Date("2024-01-15").toISOString(),
    },
    {
        name: "부산 리조트",
        address: "부산시 해운대구 해운대해변로 456",
        description: "해운대 바다가 한눈에 보이는 리조트",
        rating: 4.8,
        price: 200000,
        status: "pending",
        createdAt: new Date("2024-01-20").toISOString(),
    },
    {
        name: "제주 오션뷰 호텔",
        address: "제주시 연동 789",
        description: "제주의 푸른 바다를 품은 호텔",
        rating: 4.2,
        price: 180000,
        status: "active",
        createdAt: new Date("2024-01-10").toISOString(),
    },
    {
        name: "경주 힐튼 호텔",
        address: "경주시 불국로 321",
        description: "천년의 역사가 살아숨쉬는 경주",
        rating: 4.7,
        price: 220000,
        status: "approved",
        createdAt: new Date("2024-01-18").toISOString(),
    },
    {
        name: "인천 공항 호텔",
        address: "인천시 중구 공항로 654",
        description: "편리한 교통과 안락한 객실",
        rating: 3.9,
        price: 120000,
        status: "rejected",
        createdAt: new Date("2024-01-12").toISOString(),
    },
];

// [수정됨] 예약 정보의 이름과 이메일도 함께 변경
const bookings = [
    {
        hotelName: "서울 그랜드 호텔",
        userName: "김민수", // 변경
        userEmail: "minsu@example.com",
        checkIn: new Date("2024-02-01").toISOString(),
        checkOut: new Date("2024-02-03").toISOString(),
        guests: { adults: 2, children: 1 },
        amount: 300000,
        status: "confirmed",
        createdAt: new Date("2024-01-15").toISOString(),
    },
    {
        hotelName: "부산 리조트",
        userName: "임우진", // 변경
        userEmail: "woojin@example.com",
        checkIn: new Date("2024-02-05").toISOString(),
        checkOut: new Date("2024-02-07").toISOString(),
        guests: { adults: 2, children: 0 },
        amount: 400000,
        status: "pending",
        createdAt: new Date("2024-01-20").toISOString(),
    },
    {
        hotelName: "제주 오션뷰 호텔",
        userName: "조용준", // 변경
        userEmail: "yongjun@example.com",
        checkIn: new Date("2024-01-25").toISOString(),
        checkOut: new Date("2024-01-27").toISOString(),
        guests: { adults: 1, children: 0 },
        amount: 360000,
        status: "completed",
        createdAt: new Date("2024-01-10").toISOString(),
    },
];

// [수정됨] 리뷰 작성자 이름과 이메일도 함께 변경
const reviews = [
    {
        hotelName: "서울 그랜드 호텔",
        userName: "김민수", // 변경
        userEmail: "minsu@example.com",
        rating: 5,
        content: "정말 깨끗하고 서비스가 훌륭했습니다. 다음에도 또 이용하고 싶어요!",
        reported: false,
        createdAt: new Date("2024-01-20").toISOString(),
    },
    {
        hotelName: "부산 리조트",
        userName: "임우진", // 변경
        userEmail: "woojin@example.com",
        rating: 4,
        content: "해변이 가까워서 좋았습니다. 다만 조식이 좀 아쉬웠어요.",
        reported: false,
        createdAt: new Date("2024-01-18").toISOString(),
    },
    {
        hotelName: "제주 오션뷰 호텔",
        userName: "조용준", // 변경
        userEmail: "yongjun@example.com",
        rating: 3,
        content: "시설은 괜찮은데 직원 서비스가 별로였습니다.",
        reported: true,
        createdAt: new Date("2024-01-15").toISOString(),
    },
];

const coupons = [
    {
        code: "WELCOME2024",
        name: "신규 가입 환영 쿠폰",
        discountType: "percentage",
        discountValue: 10,
        startDate: new Date("2024-01-01").toISOString(),
        endDate: new Date("2024-12-31").toISOString(),
        usageLimit: 1000,
        usedCount: 245,
        isActive: true,
        createdAt: new Date("2023-12-20").toISOString(),
    },
    {
        code: "SUMMER50000",
        name: "여름 특가 쿠폰",
        discountType: "fixed",
        discountValue: 50000,
        startDate: new Date("2024-06-01").toISOString(),
        endDate: new Date("2024-08-31").toISOString(),
        usageLimit: 500,
        usedCount: 500,
        isActive: true,
        createdAt: new Date("2024-05-15").toISOString(),
    },
];

// 4. 데이터 삽입 함수
const initData = async () => {
    try {
        console.log("📡 MongoDB 연결 중...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB 연결 성공!");

        // 기존 데이터 삭제 (중복 방지)
        await User.deleteMany({});
        await Hotel.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        await Coupon.deleteMany({});
        console.log("🗑️ 기존 데이터 삭제 완료");

        // 데이터 삽입
        await User.insertMany(users);
        await Hotel.insertMany(hotels);
        await Booking.insertMany(bookings);
        await Review.insertMany(reviews);
        await Coupon.insertMany(coupons);

        console.log("🎉 초기 데이터 삽입 완료!");
        process.exit(0);
    } catch (error) {
        console.error("❌ 데이터 초기화 실패:", error);
        process.exit(1);
    }
};

initData();