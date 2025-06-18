import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../index';

const prisma = new PrismaClient();

describe('Auth Service', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup test database
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up before each test
    await prisma.refreshToken.deleteMany();
    await prisma.otpVerification.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'Test123!@#',
      firstName: 'John',
      lastName: 'Doe',
      businessName: 'Test Business',
      businessType: 'LLC'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(validUser.email);
      expect(response.body.data.user.firstName).toBe(validUser.firstName);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should return 409 if user already exists', async () => {
      // Create user first
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Try to create same user again
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('USER_EXISTS');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          password: 'weak'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing password, firstName, lastName
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      email: 'test@example.com',
      password: 'Test123!@#',
      firstName: 'John',
      lastName: 'Doe'
    };

    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: userData.password
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email
          // Missing password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and get refresh token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
          firstName: 'John',
          lastName: 'Doe'
        });

      refreshToken = registerResponse.body.data.tokens.refreshToken;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
      // New refresh token should be different
      expect(response.body.data.tokens.refreshToken).not.toBe(refreshToken);
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
      // Register and get access token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
          firstName: 'John',
          lastName: 'Doe'
        });

      accessToken = registerResponse.body.data.tokens.accessToken;
      userId = registerResponse.body.data.user.id;
    });

    it('should return current user data', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.password).toBeUndefined(); // Password should not be returned
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('MISSING_TOKEN');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and get refresh token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
          firstName: 'John',
          lastName: 'Doe'
        });

      refreshToken = registerResponse.body.data.tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify token is revoked by trying to refresh
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });

    it('should work without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on auth endpoints', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Make multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(userData);
      }

      // The 6th attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.service).toBe('auth-service');
      expect(response.body.status).toBe('healthy');
    });
  });
});