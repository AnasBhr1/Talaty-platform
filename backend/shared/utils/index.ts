// backend/shared/utils/index.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWTPayload, ApiResponse } from '../types';

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// JWT utilities
export const generateAccessToken = (userId: string, email: string): string => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
    email,
    type: 'access'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'talaty-auth-service'
  });
};

export const generateRefreshToken = (userId: string, email: string): string => {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
    email,
    type: 'refresh'
  };
  
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'talaty-auth-service'
  });
};

export const verifyToken = (token: string, isRefreshToken = false): JWTPayload => {
  const secret = isRefreshToken ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as JWTPayload;
};

// OTP utilities
export const generateOTP = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export const generateSecureToken = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Response utilities
export const createSuccessResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  timestamp: new Date()
});

export const createErrorResponse = (
  message: string,
  error?: string
): ApiResponse => ({
  success: false,
  message,
  error,
  timestamp: new Date()
});

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isAllowedFileType = (mimeType: string): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return allowedTypes.includes(mimeType);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Date utilities
export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export const isExpired = (date: Date): boolean => {
  return new Date() > date;
};

// Encryption utilities for sensitive data at rest
export const encryptSensitiveData = (data: string): { encrypted: string; iv: string } => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex')
  };
};

export const decryptSensitiveData = (encryptedData: string, ivHex: string): string => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Scoring utilities
export const calculateCompletionPercentage = (user: any, documents: any[]): number => {
  let score = 0;
  const maxScore = 100;
  
  // Personal info (30 points)
  if (user.firstName && user.lastName) score += 10;
  if (user.email) score += 5;
  if (user.phone) score += 5;
  if (user.address && user.city && user.country) score += 10;
  
  // Business info (30 points)
  if (user.businessName) score += 10;
  if (user.businessType) score += 10;
  if (user.registrationNumber) score += 10;
  
  // Documents (40 points)
  const requiredDocs = ['ID_CARD', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'BANK_STATEMENT'];
  const uploadedDocs = documents.filter(doc => doc.status === 'VERIFIED');
  const docScore = (uploadedDocs.length / requiredDocs.length) * 40;
  score += docScore;
  
  return Math.min(score, maxScore);
};

// Rate limiting utilities
export const createRateLimitKey = (ip: string, endpoint: string): string => {
  return `rate_limit:${ip}:${endpoint}`;
};

// Logging utilities
export const sanitizeForLogging = (obj: any): any => {
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  const sanitized = { ...obj };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
};