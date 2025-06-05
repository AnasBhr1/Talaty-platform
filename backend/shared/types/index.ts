// backend/shared/types/index.ts

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  eKycStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  isVerified: boolean;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  s3Url: string;
  documentType: 'ID_CARD' | 'BUSINESS_LICENSE' | 'TAX_CERTIFICATE' | 'BANK_STATEMENT' | 'OTHER';
  status: 'UPLOADED' | 'PROCESSING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ScoreCalculation {
  userId: string;
  totalScore: number;
  breakdown: {
    personalInfo: number;
    businessInfo: number;
    documents: number;
    verification: number;
  };
  factors: string[];
  recommendations: string[];
  calculatedAt: Date;
}

export interface NotificationPayload {
  userId: string;
  type: 'EMAIL' | 'SMS';
  recipient: string;
  subject?: string;
  message: string;
  templateId?: string;
  data?: Record<string, any>;
}

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface OTPVerification {
  id: string;
  userId: string;
  code: string;
  type: 'EMAIL' | 'SMS';
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  details?: Record<string, any>;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface DocumentUploadRequest {
  documentType: Document['documentType'];
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}