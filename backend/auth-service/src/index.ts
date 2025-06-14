const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Mock database
const users: any[] = [];

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

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
    'fallback-secret-key',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email, type: 'refresh' },
    'fallback-refresh-secret',
    { expiresIn: '7d' }
  );
};

const generateUserId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Register endpoint
app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { email, password, firstName, lastName, businessName, businessType, phone } = req.body;

    console.log('Registration request:', { email, firstName, lastName });

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json(
        createErrorResponse('Missing required fields', 'VALIDATION_ERROR')
      );
    }

    // Check if user exists
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
    const user = {
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

    // Save user
    users.push(user);

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

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
});

// Login endpoint
app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    console.log('Login request:', { email });

    // Basic validation
    if (!email || !password) {
      return res.status(400).json(
        createErrorResponse('Email and password are required', 'VALIDATION_ERROR')
      );
    }

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
});

// Get current user
app.get('/api/auth/me', (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json(
      createErrorResponse('Access token required', 'MISSING_TOKEN')
    );
  }

  try {
    const decoded = jwt.verify(token, 'fallback-secret-key');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json(
        createErrorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(
      createSuccessResponse('User data retrieved successfully', userWithoutPassword)
    );
  } catch (error) {
    res.status(401).json(
      createErrorResponse('Invalid or expired token', 'INVALID_TOKEN')
    );
  }
});

// Root endpoint
app.get('/', (req: any, res: any) => {
  res.json({
    service: 'Talaty Auth Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Register: http://localhost:${PORT}/api/auth/register`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
});

export default app;