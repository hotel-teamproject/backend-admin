const corsOptions = {
    // [통합] 배포 환경 변수 + 도커(80) + 로컬 개발(5173) 모두 허용
    origin: [
        process.env.FRONT_ORIGIN, // 팀 프로젝트 배포 설정
        'http://localhost',       // 도커/Nginx 환경
        'http://localhost:5173'   // 로컬 개발 환경
    ].filter(Boolean),            // 설정되지 않은 값(undefined)은 안전하게 제거
    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24시간
};

module.exports = { corsOptions };