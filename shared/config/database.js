const mongoose = require('mongoose');

/**
 * MongoDB 연결 함수
 */
exports.connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI 환경 변수가 설정되지 않았습니다');
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✓ MongoDB 연결 성공');
        return mongoose.connection;
    } catch (error) {
        console.error('✗ MongoDB 연결 실패:', error.message);
        process.exit(1);
    }
};

/**
 * MongoDB 연결 해제 함수
 */
exports.disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB 연결 해제');
    } catch (error) {
        console.error('MongoDB 연결 해제 실패:', error.message);
    }
};
