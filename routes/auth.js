    // routes/auth.js
router.post('/register', authController.register);
router.post('/login', authController.login);
// JWT 미들웨어로 권한 체크
