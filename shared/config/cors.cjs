const corsOptions = {
    // [수정됨] 도커(80)와 로컬개발(5173) 모두 허용
    origin: ['http://localhost', 'http://localhost:5173',
        'http://localhost:5174'], 
    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
};

module.exports = { corsOptions };