// backend/auth-service/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken, 
  verifyToken,
  generateOTP,
  generateSecureToken,
  createSuccessResponse, 
  createErrorResponse,
  addMinutes,
  addDays,
  isExpired
} from '../../../shared/utils';
import { logger } from '../../../shared/middleware';
import { 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest 
} from '../../../shared/types';
import { sendEmail, sendSMS } from '../services/notification.service';

const prisma = new PrismaClient();

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone, businessName, businessType }: RegisterRequest = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json(
          createErrorResponse('User already exists with this email', 'USER_EXISTS')
        );
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          businessName,
          businessType,
          eKycStatus: 'PENDING'
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          businessName: true,
          businessType: true,
          eKycStatus: true,
          isVerified: true,
          createdAt: true
        }
      });

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: addDays(new Date(), 7)
        }
      });

      // Generate email verification OTP
      const emailOtp = generateOTP(6);
      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          code: emailOtp,
          type: 'EMAIL',
          purpose: 'EMAIL_VERIFICATION',
          expiresAt: addMinutes(new Date(), 15)
        }
      });

      // Send welcome email with OTP
      await sendEmail(
        user.email,
        'Welcome to Talaty - Verify Your Email',
        'welcome-verification',
        { 
          firstName: user.firstName,
          otp: emailOtp,
          expiresIn: '15 minutes'
        }
      );

      // Log successful registration
      logger.info(`User registered successfully: ${user.email}`);

      res.status(201).json(
        createSuccessResponse('Registration successful', {
          user,
          tokens: {
            accessToken,
            refreshToken,
            expiresAt: addMinutes(new Date(), 15)
          }
        })
      );
    } catch (error) {
      logger.error('Registration error:', error);
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

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json(
          createErrorResponse('Invalid email or password', 'INVALID_CREDENTIALS')
        );
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json(
          createErrorResponse('Invalid email or password', 'INVALID_CREDENTIALS')
        );
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: addDays(new Date(), 7)
        }
      });

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      logger.info(`User logged in successfully: ${user.email}`);

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
      logger.error('Login error:', error);
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
      const { refreshToken }: RefreshTokenRequest = req.body;

      if (!refreshToken) {
        return res.status(401).json(
          createErrorResponse('Refresh token required', 'MISSING_REFRESH_TOKEN')
        );
      }

      // Verify refresh token
      const decoded = verifyToken(refreshToken, true);

      // Check if refresh token exists and is not revoked
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true }
      });

      if (!storedToken || storedToken.isRevoked || isExpired(storedToken.expiresAt)) {
        return res.status(401).json(
          createErrorResponse('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN')
        );
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(storedToken.userId, storedToken.user.email);
      const newRefreshToken = generateRefreshToken(storedToken.userId, storedToken.user.email);

      // Revoke old refresh token and create new one
      await prisma.$transaction([
        prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { isRevoked: true }
        }),
        prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: storedToken.userId,
            expiresAt: addDays(new Date(), 7)
          }
        })
      ]);

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
      logger.error('Token refresh error:', error);
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
        await prisma.refreshToken.updateMany({
          where: { 
            token: refreshToken,
            isRevoked: false 
          },
          data: { isRevoked: true }
        });
      }

      res.json(
        createSuccessResponse('Logout successful')
      );
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json(
        createErrorResponse('Logout failed', 'LOGOUT_ERROR')
      );
    }
  }

  /**
   * Send email verification OTP
   */
  async sendEmailVerification(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      if (user.emailVerifiedAt) {
        return res.status(400).json(
          createErrorResponse('Email already verified', 'EMAIL_ALREADY_VERIFIED')
        );
      }

      // Generate new OTP
      const otp = generateOTP(6);

      // Invalidate previous OTPs
      await prisma.otpVerification.updateMany({
        where: {
          userId,
          type: 'EMAIL',
          purpose: 'EMAIL_VERIFICATION',
          isUsed: false
        },
        data: { isUsed: true }
      });

      // Create new OTP
      await prisma.otpVerification.create({
        data: {
          userId,
          code: otp,
          type: 'EMAIL',
          purpose: 'EMAIL_VERIFICATION',
          expiresAt: addMinutes(new Date(), 15)
        }
      });

      // Send email
      await sendEmail(
        user.email,
        'Verify Your Email - Talaty',
        'email-verification',
        { 
          firstName: user.firstName,
          otp,
          expiresIn: '15 minutes'
        }
      );

      res.json(
        createSuccessResponse('Verification email sent successfully')
      );
    } catch (error) {
      logger.error('Send email verification error:', error);
      res.status(500).json(
        createErrorResponse('Failed to send verification email', 'EMAIL_VERIFICATION_ERROR')
      );
    }
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { otp } = req.body;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      // Find valid OTP
      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          userId,
          code: otp,
          type: 'EMAIL',
          purpose: 'EMAIL_VERIFICATION',
          isUsed: false
        }
      });

      if (!otpRecord) {
        return res.status(400).json(
          createErrorResponse('Invalid or expired OTP', 'INVALID_OTP')
        );
      }

      if (isExpired(otpRecord.expiresAt)) {
        return res.status(400).json(
          createErrorResponse('OTP has expired', 'OTP_EXPIRED')
        );
      }

      // Mark OTP as used and verify email
      await prisma.$transaction([
        prisma.otpVerification.update({
          where: { id: otpRecord.id },
          data: { isUsed: true }
        }),
        prisma.user.update({
          where: { id: userId },
          data: { 
            emailVerifiedAt: new Date(),
            isVerified: true
          }
        })
      ]);

      res.json(
        createSuccessResponse('Email verified successfully')
      );
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json(
        createErrorResponse('Email verification failed', 'EMAIL_VERIFICATION_ERROR')
      );
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email }: PasswordResetRequest = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Don't reveal if user exists or not for security
      if (!user) {
        return res.json(
          createSuccessResponse('If an account with that email exists, a password reset link has been sent')
        );
      }

      // Generate reset token
      const resetToken = generateSecureToken(32);

      // Invalidate previous reset tokens
      await prisma.otpVerification.updateMany({
        where: {
          userId: user.id,
          purpose: 'PASSWORD_RESET',
          isUsed: false
        },
        data: { isUsed: true }
      });

      // Create password reset token
      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          code: resetToken,
          type: 'EMAIL',
          purpose: 'PASSWORD_RESET',
          expiresAt: addMinutes(new Date(), 30) // 30 minutes
        }
      });

      // Send reset email
      await sendEmail(
        user.email,
        'Reset Your Password - Talaty',
        'password-reset',
        { 
          firstName: user.firstName,
          resetToken,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
          expiresIn: '30 minutes'
        }
      );

      res.json(
        createSuccessResponse('If an account with that email exists, a password reset link has been sent')
      );
    } catch (error) {
      logger.error('Password reset request error:', error);
      res.status(500).json(
        createErrorResponse('Failed to process password reset request', 'PASSWORD_RESET_ERROR')
      );
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(req: Request, res: Response) {
    try {
      const { token, newPassword }: PasswordResetConfirmRequest = req.body;

      // Find valid reset token
      const resetRecord = await prisma.otpVerification.findFirst({
        where: {
          code: token,
          purpose: 'PASSWORD_RESET',
          isUsed: false
        },
        include: { user: true }
      });

      if (!resetRecord) {
        return res.status(400).json(
          createErrorResponse('Invalid or expired reset token', 'INVALID_RESET_TOKEN')
        );
      }

      if (isExpired(resetRecord.expiresAt)) {
        return res.status(400).json(
          createErrorResponse('Reset token has expired', 'TOKEN_EXPIRED')
        );
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password and mark token as used
      await prisma.$transaction([
        prisma.otpVerification.update({
          where: { id: resetRecord.id },
          data: { isUsed: true }
        }),
        prisma.user.update({
          where: { id: resetRecord.userId },
          data: { password: hashedPassword }
        }),
        // Revoke all refresh tokens for security
        prisma.refreshToken.updateMany({
          where: { 
            userId: resetRecord.userId,
            isRevoked: false 
          },
          data: { isRevoked: true }
        })
      ]);

      res.json(
        createSuccessResponse('Password reset successful')
      );
    } catch (error) {
      logger.error('Password reset confirmation error:', error);
      res.status(500).json(
        createErrorResponse('Password reset failed', 'PASSWORD_RESET_ERROR')
      );
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json(
          createErrorResponse('User not authenticated', 'UNAUTHORIZED')
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          businessName: true,
          businessType: true,
          registrationNumber: true,
          address: true,
          city: true,
          country: true,
          eKycStatus: true,
          isVerified: true,
          score: true,
          emailVerifiedAt: true,
          phoneVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return res.status(404).json(
          createErrorResponse('User not found', 'USER_NOT_FOUND')
        );
      }

      res.json(
        createSuccessResponse('User data retrieved successfully', user)
      );
    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json(
        createErrorResponse('Failed to retrieve user data', 'USER_RETRIEVAL_ERROR')
      );
    }
  }
}