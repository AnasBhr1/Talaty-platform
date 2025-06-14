// backend/auth-service/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Simple validation middleware
const validateRegistration = (req: any, res: any, next: any) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

const validateLogin = (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

const validateRefreshToken = (req: any, res: any, next: any) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Routes
router.post('/register', validateRegistration, authController.register.bind(authController));
router.post('/login', validateLogin, authController.login.bind(authController));
router.post('/refresh', validateRefreshToken, authController.refreshToken.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/me', authController.getCurrentUser.bind(authController));

// Optional routes (mock implementations)
router.post('/verify-email/send', authController.sendEmailVerification.bind(authController));
router.post('/verify-email', authController.verifyEmail.bind(authController));
router.post('/password/reset', authController.requestPasswordReset.bind(authController));
router.post('/password/reset/confirm', authController.confirmPasswordReset.bind(authController));

export default router;