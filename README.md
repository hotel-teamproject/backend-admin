# Backend Admin - 기능별(도메인) 구조

## 📋 프로젝트 구조

```
backend-admin/
├── auth/                      # 인증 도메인 (루트 레벨)
│   ├── model.js               # User 스키마
│   ├── service.js             # 비즈니스 로직
│   ├── controller.js          # 요청 처리
│   └── routes.js              # 라우트 정의
│
├── posts/                     # 게시물 도메인
│   ├── model.js
│   ├── service.js
│   ├── controller.js
│   └── routes.js
│
├── admin/                     # 관리자 도메인
├── upload/                    # 파일 업로드 도메인
├── coupon/                    # 쿠폰 도메인
├── hotel/                     # 호텔 도메인
├── reservation/               # 예약 도메인
├── notice/                    # 공지사항 도메인
│
├── shared/                    # 공유 리소스
│   ├── middleware/            # 미들웨어
│   │   ├── authMiddleware.js  # JWT 검증
│   │   ├── roleMiddleware.js  # 역할 기반 접근 제어
│   │   └── errorHandler.js    # 에러 처리
│   │
│   ├── utils/                 # 유틸리티
│   │   ├── response.js        # 표준 응답 포맷
│   │   └── constants.js       # 상수 정의
│   │
│   └── config/                # 설정
│       ├── database.js        # MongoDB 연결
│       └── cors.js            # CORS 설정
│
├── app.js                     # Express 앱 설정 (루트)
├── index.js                   # 진입점 (루트)
├── package.json
├── .env
└── README.md
```

## 🚀 시작하기

### 1. 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정
\`.env\` 파일 생성:
\`\`\`env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/backend-admin
JWT_SECRET=your-secret-key-here
FRONT_ORIGIN=http://localhost:5173
\`\`\`

### 3. 서버 실행
\`\`\`bash
npm run dev    # 개발 모드 (nodemon 사용)
npm start      # 프로덕션 모드
\`\`\`

## 📚 도메인 구조 설명

각 도메인은 다음 4가지 파일로 구성됩니다:

- **model.js**: MongoDB 스키마 정의
- **service.js**: 비즈니스 로직 (재사용 가능한 함수들)
- **controller.js**: HTTP 요청 처리 (service 호출)
- **routes.js**: 라우트 정의 (URL 매핑)

### 요청 처리 흐름

\`\`\`
GET /api/auth/profile
  ↓
authRoutes (routes.js)
  ↓
authMiddleware.verifyToken (shared/middleware/)
  ↓
authController.getProfile (controller.js)
  ↓
authService.getProfile (service.js)
  ↓
User.findById (model.js - MongoDB)
\`\`\`

## 🔐 미들웨어 사용 예시

### 인증 필요
\`\`\`javascript
const { verifyToken } = require('../shared/middleware/authMiddleware');

router.get('/protected', verifyToken, controller.action);
\`\`\`

### 관리자만 접근
\`\`\`javascript
const { verifyToken } = require('../shared/middleware/authMiddleware');
const { requireAdmin } = require('../shared/middleware/roleMiddleware');

router.delete('/admin/users/:id', verifyToken, requireAdmin, controller.deleteUser);
\`\`\`

### 관리자 또는 모더레이터
\`\`\`javascript
const { requireAdminOrMod } = require('../shared/middleware/roleMiddleware');

router.put('/moderate', verifyToken, requireAdminOrMod, controller.moderate);
\`\`\`

## 📝 API 응답 형식

모든 API는 다음 형식으로 응답합니다:

### 성공 응답
\`\`\`json
{
  "success": true,
  "statusCode": 200,
  "message": "작업 완료",
  "data": { /* 데이터 */ }
}
\`\`\`

### 에러 응답
\`\`\`json
{
  "success": false,
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "상세 정보"
}
\`\`\`

## 🛠️ 새 도메인 추가하기

새 도메인(예: \`products\`)을 추가하려면:

1. 루트에 새 폴더 생성: \`mkdir products\`
2. 4가지 파일 생성:
   - \`products/model.js\` - Mongoose 스키마
   - \`products/service.js\` - 비즈니스 로직
   - \`products/controller.js\` - 요청 처리
   - \`products/routes.js\` - 라우트 정의
3. \`app.js\`에 라우트 등록:
   \`\`\`javascript
   const productRoutes = require('./products/routes');
   app.use('/api/products', productRoutes);
   \`\`\`
4. 그 후 \`npm run dev\`로 서버 재시작

## 📖 추천 개발 순서

1. **Model** 정의 - 데이터베이스 스키마 설계
2. **Service** 작성 - 비즈니스 로직 구현
3. **Controller** 작성 - 요청 처리 및 응답
4. **Routes** 정의 - URL 매핑
5. **테스트** - Postman 등으로 API 검증

## 🐛 주요 기능

- ✅ JWT 기반 인증
- ✅ 역할 기반 접근 제어 (RBAC)
- ✅ 표준화된 응답 포맷
- ✅ 전역 에러 핸들링
- ✅ CORS 설정
- ✅ 환경 변수 관리
- ✅ MongoDB 스키마 검증
- ✅ 비밀번호 해싱 (bcrypt)

## 📞 기본 제공 도메인

| 도메인 | 기능 |
|-------|------|
| **auth** | 사용자 인증, 가입, 로그인, 프로필 관리 |
| **posts** | 게시물 CRUD |
| **admin** | 관리자 기능 |
| **upload** | 파일 업로드 (S3 등) |
| **coupon** | 쿠폰 관리 |
| **hotel** | 호텔 정보 |
| **reservation** | 예약 관리 |
| **notice** | 공지사항 |

## 🔗 빠른 링크

- [Express 문서](https://expressjs.com/)
- [Mongoose 문서](https://mongoosejs.com/)
- [JWT 문서](https://jwt.io/)