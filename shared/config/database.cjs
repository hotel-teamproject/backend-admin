const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // [통합] 팀 프로젝트의 DB 이름('hotel_db')을 따르되,
        // 사용자(HEAD)의 환경변수 처리 로직(MONGODB_URI 체크 등)은 유지합니다.
        const mongoUri = process.env.MONGO_URI || 
                         process.env.MONGODB_URI || 
                         'mongodb://localhost:27017/hotel_db'; // ⬅️ 팀 규칙인 hotel_db로 통일
        
        console.log(`📡 MongoDB 연결 시도 중...`);
        
        // Mongoose 6버전 이상부터는 옵션 객체 없이 연결해도 됩니다.
        const conn = await mongoose.connect(mongoUri);

        console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
        return mongoose.connection;
    } catch (error) {
        console.error(`❌ MongoDB 연결 실패: ${error.message}`);
        // [유지] 사용자(HEAD)의 친절한 디버깅 가이드 유지
        console.error(`💡 연결 주소 확인: ${process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_db'}`);
        console.error(`💡 도커 실행 시: docker-compose.yml의 환경변수가 자동으로 설정됩니다.`);
        console.error(`💡 로컬 실행 시: MongoDB가 localhost:27017에서 실행 중인지 확인하세요.`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB 연결 해제');
    } catch (error) {
        console.error('MongoDB 연결 해제 실패:', error.message);
    }
};

module.exports = { connectDB, disconnectDB };