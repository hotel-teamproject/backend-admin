require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 모델 연결
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Reservation = require('./models/Reservation');
const Coupon = require('./models/Coupon'); // ⬅️ [NEW] 쿠폰 모델 추가

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_db');
        console.log('✅ MongoDB Connected for Seeding');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('🧹 기존 데이터 삭제 중...');
        try { await User.deleteMany({}); } catch(e) {}
        try { await Hotel.deleteMany({}); } catch(e) {}
        try { await Reservation.deleteMany({}); } catch(e) {}
        try { await Coupon.deleteMany({}); } catch(e) {} // ⬅️ 기존 쿠폰 삭제

        // 비밀번호 암호화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('1234', salt);

        // 1. 회원 생성
        console.log('👤 회원 데이터 생성 중...');
        const user1 = await User.create({
            name: '김민수',
            email: 'user1@test.com',
            password: hashedPassword,
            role: 'user',
        });

        const user2 = await User.create({
            name: '임우진',
            email: 'user2@test.com',
            password: hashedPassword,
            role: 'user',
        });
        
        await User.create({
            name: '총관리자',
            email: 'admin@hotel.com',
            password: hashedPassword,
            role: 'admin',
        });

        // 2. 호텔 생성
        console.log('🏨 호텔 데이터 생성 중...');
        const hotel = await Hotel.create({
            name: '경기도 진접 호텔',
            address: '경기도 남양주시 진접읍 진접로 456',
            description: '경기도 진접에서 즐기는 편안한 휴식',
            rooms: [
                { roomType: 'Standard', price: 150000, capacity: 2, count: 10 },
                { roomType: 'Deluxe', price: 250000, capacity: 2, count: 5 },
                { roomType: 'Suite', price: 500000, capacity: 4, count: 2 },
            ],
            images: ['https://via.placeholder.com/300x200?text=Grand+Hotel'],
        });

        // 3. 쿠폰 생성 (NEW!)
        console.log('🎟️ 쿠폰 데이터 생성 중...');
        await Coupon.create({
            name: '신규가입 환영 쿠폰',
            code: 'WELCOME2025',
            discount: 10000,
            expirationDate: new Date('2025-12-31')
        });

        await Coupon.create({
            name: '여름 바캉스 할인',
            code: 'SUMMER_SALE',
            discount: 5000,
            expirationDate: new Date('2025-08-31')
        });

        // 4. 예약 생성
        console.log('📅 예약 데이터 생성 중...');
        await Reservation.create({
            userId: user1._id,
            hotelId: hotel._id,
            roomType: 'Standard',
            checkIn: new Date('2025-12-24'),
            checkOut: new Date('2025-12-26'),
            totalPrice: 300000,
            status: 'confirmed',
        });

        await Reservation.create({
            userId: user2._id,
            hotelId: hotel._id,
            roomType: 'Deluxe',
            checkIn: new Date('2025-11-10'),
            checkOut: new Date('2025-11-12'),
            totalPrice: 500000,
            status: 'cancelled',
        });

        console.log('🎉 모든 데이터 생성 완료! (Ctrl + C로 종료하세요)');
        process.exit();

    } catch (error) {
        console.error('데이터 생성 실패:', error);
        process.exit(1);
    }
};

seedData();