// backend/auth-service/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock database - replace with real database later
const users: any[] = [];
const refreshTokens: any[] = [];

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
  eKycStatus: string;
  isVerified: boolean;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Utility functions
const createSuccessResponse = (message: string, data?: any) => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});

const createErrorResponse = (message: string, error?: string) => ({
  success: false,
  message,
  error,
  timestamp: new Date().toISOString()
});

const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email, type: 'access' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: '7d' }
  );
};

const verifyToken = (token: string, isRefreshToken = false): any => {
  const secret = isRefreshToken 
    ? (process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret')
    : (process.env.JWT_SECRET || 'fallback-secret');
  return jwt.verify(token, secret);
};

const generateUserId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone, businessName, businessType }: RegisterRequest = req.body;

      console.log('Registration request received:', { email, firstName, lastName });

      // Check if user already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(409).json(
          createErrorResponse('User already exists with this email', 'USER_EXISTS')
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const userId = generateUserId();
      const user: User = {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        businessName: businessName || null,
        businessType: businessType || null,
        eKycStatus: 'PENDING',
        isVerified: false,
        score: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save user to mock database
      users.push(user);

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Store refresh token
      refreshTokens.push({
        id: generateUserId(),
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
        isRevoked: false,
        createdAt: new Date()
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log('User registered successfully:', user.email);

      res.status(201).json(
        createSuccessResponse('Registration successful', {
          user: userWithoutPassword,
          tokens: {
            accessToken,
            refreshToken,
            expiresAt: addMinutes(new Date(), 15)
          }
        })
      );
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(
        createErrorResponse('Registration failed', 'REGISTRATION_ERROR')
      );
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      console.log('Login request received:', { email });

      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json(
          createErrorResponse('Invalid email or password', 'INVALID_CREDENTIALS')
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json(
          createErrorResponse('Invalid email or password', 'INVALID_CREDENTIALS')
        );
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Store refresh token
      refreshTokens.push({
        id: generateUserId(),
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
        isRevoked: false,
        createdAt: new Date()
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log('User logged in successfully:', user.email);

      res.json(
        createSuccessResponse('Login successful', {
          user: userWithoutPassword,
          tokens: {
            accessToken,
            refreshToken,
            expiresAt: addMinutes(new Date(), 15)
          }
        })
      );
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(
        createErrorResponse('Login failed', 'LOGIN_ERROR')
      );
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json(
          createErrorResponse('Refresh token required', 'MISSING_REFRESH_TOKEN')
        );
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = verifyToken(refreshToken, true);
      } catch (error) {
        return res.status(401).json(
          createErrorResponse('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN')
        );
      }

      // Check if refresh token exists and is not revoked
      const storedToken = refreshTokens.find(t => 
        t.token === refreshToken && 
        !t.isRevoked && 
        new Date() < t.expiresAt
      );

      if (!storedToken) {
        return res.status(401).json(
          createErrorResponse('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN')
        );
      }

      // Find user
      const user = users.find(u => u.id === decoded.userId);
      if (!user) {
        return res.status(401).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(user.id, user.email);
      const newRefreshToken = generateRefreshToken(user.id, user.email);

      // Revoke old refresh token
      const tokenIndex = refreshTokens.findIndex(t => t.id === storedToken.id);
      if (tokenIndex > -1) {
        refreshTokens[tokenIndex].isRevoked = true;
      }

      // Store new refresh token
      refreshTokens.push({
        id: generateUserId(),
        token: newRefreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
        isRevoked: false,
        createdAt: new Date()
      });

      res.json(
        createSuccessResponse('Token refreshed successfully', {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt: addMinutes(new Date(), 15)
          }
        })
      );
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json(
        createErrorResponse('Token refresh failed', 'REFRESH_TOKEN_ERROR')
      );
    }
  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // Revoke refresh token
        const tokenIndex = refreshTokens.findIndex(t => 
          t.token === refreshToken && !t.isRevoked
        );
        if (tokenIndex > -1) {
          refreshTokens[tokenIndex].isRevoked = true;
        }
      }

      res.json(
        createSuccessResponse('Logout successful')
      );
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json(
        createErrorResponse('Logout failed', 'LOGOUT_ERROR')
      );
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      if (!token) {
        return res.status(401).json(
          createErrorResponse('Access token required', 'MISSING_TOKEN')
        );
      }

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        return res.status(401).json(
          createErrorResponse('Invalid or expired token', 'INVALID_TOKEN')
        );
      }

      const user = users.find(u => u.id === decoded.userId);
      if (!user) {
        return res.status(404).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json(
        createSuccessResponse('User data retrieved successfully', userWithoutPassword)
      );
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve user data', 'USER_RETRIEVAL_ERROR')
      );
    }
  }

  /**
   * Send email verification OTP (mock)
   */
  async sendEmailVerification(req: Request, res: Response) {
    try {
      // Mock implementation
      res.json(
        createSuccessResponse('Verification email sent successfully')
      );
    } catch (error) {
      console.error('Send email verification error:', error);
      res.status(500).json(
        createErrorResponse('Failed to send verification email', 'EMAIL_VERIFICATION_ERROR')
      );
    }
  }

  /**
   * Verify email with OTP (mock)
   */
  async verifyEmail(req: Request, res: Response) {
    try {
      // Mock implementation
      res.json(
        createSuccessResponse('Email verified successfully')
      );
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json(
        createErrorResponse('Email verification failed', 'EMAIL_VERIFICATION_ERROR')
      );
    }
  }

  /**
   * Request password reset (mock)
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      // Mock implementation
      res.json(
        createSuccessResponse('If an account with that email exists, a password reset link has been sent')
      );
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json(
        createErrorResponse('Failed to process password reset request', 'PASSWORD_RESET_ERROR')
      );
    }
  }

  /**
   * Confirm password reset (mock)
   */
  async confirmPasswordReset(req: Request, res: Response) {
    try {
      // Mock implementation
      res.json(
        createSuccessResponse('Password reset successful')
      );
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      res.status(500).json(
        createErrorResponse('Password reset failed', 'PASSWORD_RESET_ERROR')
      );
    }
  }
}