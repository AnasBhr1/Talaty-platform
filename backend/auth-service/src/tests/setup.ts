import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test_user:test_password@localhost:5433/talaty_auth_test';

// Mock external services for testing
jest.mock('../services/notification.service', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
  sendSMS: jest.fn().mockResolvedValue(undefined),
  sendOTPSMS: jest.fn().mockResolvedValue(undefined),
  verifyEmailConfig: jest.fn().mockResolvedValue(true),
  verifySMSConfig: jest.fn().mockResolvedValue(true)
}));

// Increase timeout for database operations
jest.setTimeout(30000);