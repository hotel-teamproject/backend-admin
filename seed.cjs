// seed.cjs
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 모델 불러오기 (경로 확인 필수)
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Reservation = require('./models/Reservation');

// DB 연결
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel-admin');
        console.log('✅ MongoDB Connected for Seeding');
    } catch (err) {
        console.error('❌ DB Connection Error:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // 1. 기존 데이터 싹 비우기 (중복 방지)
        await User.deleteMany({});
        await Hotel.deleteMany({});
        await Reservation.deleteMany({});
        console.log('🗑️ 기존 데이터 삭제 완료');

        // 2. 관리자 및 유저 생성
        const hashedPassword = await bcrypt.hash('1234', 10); // 비밀번호는 1234

        const admin = await User.create({
            email: 'admin@hotel.com',
            password: hashedPassword,
            name: '총관리자',
            role: 'admin'
        });

        const user1 = await User.create({
            email: 'user1@test.com',
            password: hashedPassword,
            name: '김철수',
            role: 'user'
        });

        console.log('👤 유저/관리자 생성 완료 (비번: 1234)');

        // 3. 호텔 생성
        const hotels = await Hotel.insertMany([
            {
                name: "서울 그랜드 호텔",
                address: "서울시 강남구 테헤란로 123",
                description: "서울의 중심에서 즐기는 최고급 호캉스",
                rooms: [
                    { roomType: "Standard", price: 150000, capacity: 2, count: 10 },
                    { roomType: "Deluxe", price: 250000, capacity: 2, count: 5 },
                    { roomType: "Suite", price: 500000, capacity: 4, count: 2 }
                ],
                images: ["https://via.placeholder.com/300x200?text=Grand+Hotel"],
                isActive: true
            },
            {
                name: "부산 오션뷰 리조트",
                address: "부산시 해운대구 해변로 55",
                description: "눈 뜨면 바다가 보이는 낭만적인 리조트",
                rooms: [
                    { roomType: "Ocean View", price: 200000, capacity: 2, count: 20 },
                    { roomType: "Family", price: 350000, capacity: 4, count: 10 }
                ],
                images: ["https://via.placeholder.com/300x200?text=Ocean+View"],
                isActive: true
            },
            {
                name: "제주 힐링 펜션",
                address: "제주시 애월읍 77",
                description: "제주의 자연을 그대로 느낄 수 있는 공간",
                rooms: [
                    { roomType: "Standard", price: 100000, capacity: 2, count: 5 }
                ],
                images: ["https://via.placeholder.com/300x200?text=Jeju+Pension"],
                isActive: true
            }
        ]);
        console.log('🏨 호텔 3개 생성 완료');

        // 4. 예약 데이터 생성 (김철수가 서울 호텔 예약)
        await Reservation.create([
            {
                hotelId: hotels[0]._id, // 서울 호텔
                userId: user1._id,      // 김철수
                roomType: "Standard",
                guestName: "김철수",
                checkIn: new Date("2025-12-24"),
                checkOut: new Date("2025-12-26"),
                totalPrice: 300000,
                status: "confirmed"
            },
            {
                hotelId: hotels[1]._id, // 부산 호텔
                userId: user1._id,      // 김철수
                roomType: "Ocean View",
                guestName: "김철수 가족",
                checkIn: new Date("2026-01-01"),
                checkOut: new Date("2026-01-03"),
                totalPrice: 400000,
                status: "pending"
            }
        ]);
        console.log('📅 예약 데이터 2개 생성 완료');

        console.log('✨ 모든 데이터 시딩 성공!');
        process.exit(0);

    } catch (error) {
        console.error('❌ 데이터 넣다가 에러남:', error);
        process.exit(1);
    }
};

seedData();