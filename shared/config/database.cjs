const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // 🟢 [확인] 기본값이 'hotel-project'로 잘 설정되어 있습니다.
        const mongoUri = process.env.MONGO_URI || 
                         process.env.MONGODB_URI || 
                         'mongodb://localhost:27017/hotel-project';
        
        console.log(`📡 MongoDB 연결 시도 중...`);
        
        const conn = await mongoose.connect(mongoUri);

        console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
        return mongoose.connection;
    } catch (error) {
        console.error(`❌ MongoDB 연결 실패: ${error.message}`);
        console.error(`💡 시도한 주소: ${process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-project'}`);
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