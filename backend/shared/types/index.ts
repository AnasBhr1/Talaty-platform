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
  state?: string;
  country?: string;
  postalCode?: string;
  eKycStatus: 'PENDING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'REJECTED' | 'SUSPENDED';
  isVerified: boolean;
  isActive: boolean;
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
  documentType: 'ID_CARD' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'BUSINESS_LICENSE' | 'TAX_CERTIFICATE' | 'BANK_STATEMENT' | 'UTILITY_BILL' | 'PROOF_OF_ADDRESS' | 'REGISTRATION_CERTIFICATE' | 'FINANCIAL_STATEMENT' | 'OTHER';
  status: 'UPLOADED' | 'PROCESSING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'PENDING_REVIEW';
  uploadedAt: Date;
  processedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  metadata?: any;
  checksum?: string;
  version: number;
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

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
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
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
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
  purpose: 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION' | 'PASSWORD_RESET' | 'LOGIN_VERIFICATION' | 'ACCOUNT_RECOVERY';
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt: Date;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  memory?: any;
  version?: string;
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
  state?: string;
  country?: string;
  postalCode?: string;
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

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SearchQuery {
  q?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeQuery {
  startDate?: Date;
  endDate?: Date;
}

// File upload types
export interface FileUploadResult {
  location: string;
  key: string;
  bucket: string;
  etag: string;
}

export interface FileMetadata {
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  etag?: string;
}

// Business verification types
export interface BusinessRegistrationData {
  registrationNumber: string;
  businessName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DISSOLVED';
  registrationDate: string;
  businessType: string;
  address?: string;
  officers?: Array<{
    name: string;
    role: string;
    appointmentDate: string;
  }>;
}

export interface BusinessVerificationResult {
  isValid: boolean;
  data?: BusinessRegistrationData;
  error?: string;
  source: string;
  verifiedAt: Date;
}

// Address validation types
export interface Address {
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

export interface StandardizedAddress extends Address {
  latitude?: number;
  longitude?: number;
  confidence: number;
  components: {
    streetNumber?: string;
    streetName?: string;
    neighborhood?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
}

export interface AddressValidationResult {
  isValid: boolean;
  confidence: number;
  standardizedAddress?: StandardizedAddress;
  suggestions?: StandardizedAddress[];
  error?: string;
  source: string;
  validatedAt: Date;
}

// Audit log types
export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// System settings types
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'WELCOME' | 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION' | 'DOCUMENT_UPLOADED' | 'DOCUMENT_VERIFIED' | 'DOCUMENT_REJECTED' | 'SCORE_UPDATED' | 'EKYC_COMPLETED' | 'PASSWORD_RESET' | 'SECURITY_ALERT' | 'SYSTEM_MAINTENANCE';
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  recipient: string;
  subject?: string;
  message: string;
  templateId?: string;
  data?: any;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
}