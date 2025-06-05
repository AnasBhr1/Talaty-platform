# Talaty Platform - Complete Installation Guide

## 📋 Prerequisites

Before installing Talaty Platform, ensure you have the following installed:

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 9+** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Docker & Docker Compose** - [Download here](https://docker.com/) (for databases)

### Optional but Recommended
- **PostgreSQL 15+** (if not using Docker)
- **Redis 7+** (if not using Docker)
- **AWS CLI** (for S3 setup)

### External Service Accounts (Optional)
- **AWS Account** (for S3 document storage)
- **SendGrid Account** (for email notifications)
- **Twilio Account** (for SMS notifications)

## 🚀 Quick Installation

### Step 1: Create Project Structure
```bash
# Create main directory
mkdir talaty-platform
cd talaty-platform

# Create all required directories
mkdir -p backend/{shared/{types,utils,middleware,prisma},auth-service,user-service,document-service,scoring-service,notification-service}
mkdir -p frontend/src/{app,components,lib,types}
mkdir -p scripts logs
```

### Step 2: Copy All Files

Copy each file from the artifacts into their respective directories:

#### Backend Shared Files
```bash
# Copy shared utilities
cp [artifact_content] backend/shared/types/index.ts
cp [artifact_content] backend/shared/utils/index.ts
cp [artifact_content] backend/shared/middleware/index.ts
cp [artifact_content] backend/shared/prisma/schema.prisma
```

#### Auth Service
```bash
# Navigate to auth service
cd backend/auth-service

# Copy all auth service files
cp [artifact_content] package.json
cp [artifact_content] .env.example
cp [artifact_content] src/index.ts
cp [artifact_content] src/controllers/auth.controller.ts
cp [artifact_content] src/routes/auth.routes.ts
cp [artifact_content] src/validation/auth.validation.ts
cp [artifact_content] src/services/notification.service.ts
cp [artifact_content] src/config/swagger.config.ts
cp [artifact_content] Dockerfile
cp [artifact_content] src/tests/auth.test.ts
cp [artifact_content] jest.config.js
cp [artifact_content] src/tests/setup.ts

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

cd ../..
```

#### User Service
```bash
cd backend/user-service

# Copy user service files
cp [artifact_content] package.json
cp [artifact_content] .env.example
cp [artifact_content] src/controllers/user.controller.ts
cp [artifact_content] src/routes/user.routes.ts
cp [artifact_content] src/validation/user.validation.ts
cp [artifact_content] src/services/businessVerification.service.ts
cp [artifact_content] src/services/addressValidation.service.ts

# Create basic index.ts
cat > src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

import { 
  corsOptions, 
  requestLogger, 
  errorHandler, 
  generalRateLimit,
  securityHeaders,
  healthCheck,
  logger 
} from '../../shared/middleware';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(requestLogger);
app.use(securityHeaders);
app.use(generalRateLimit);

// Health check
app.get('/health', healthCheck('user-service'));

// Routes
app.use('/api/user', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Talaty User Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 User Service running on port ${PORT}`);
});

export default app;
EOF

# Copy TypeScript config
cp ../auth-service/tsconfig.json .

cd ../..
```

#### Document Service
```bash
cd backend/document-service

# Copy document service files
cp [artifact_content] package.json
cp [artifact_content] .env.example
cp [artifact_content] src/controllers/document.controller.ts
cp [artifact_content] src/services/s3.service.ts
cp [artifact_content] src/services/documentProcessor.service.ts

# Create additional required files...
# (Similar pattern for other services)

cd ../..
```

#### Frontend Files
```bash
cd frontend

# Initialize Next.js project if not exists
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --skip-install

# Copy frontend files
cp [artifact_content] src/app/layout.tsx
cp [artifact_content] src/app/page.tsx
cp [artifact_content] src/app/auth/login/page.tsx

cd ..
```

#### Docker and Scripts
```bash
# Copy Docker and setup files
cp [artifact_content] backend/docker-compose.yml
cp [artifact_content] scripts/run-all.sh

# Make scripts executable
chmod +x scripts/run-all.sh
```

### Step 3: Install Dependencies

```bash
# Install shared dependencies
cd backend/shared
npm init -y
npm install express @types/express typescript @types/node prisma @prisma/client bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken winston joi express-rate-limit

# Install each service dependencies
cd ../auth-service
npm install

cd ../user-service  
npm install

cd ../document-service
npm install

cd ../scoring-service
npm install

cd ../notification-service
npm install

# Install frontend dependencies
cd ../../frontend
npm install

cd ..
```

### Step 4: Setup Environment Variables

```bash
# Copy and customize environment files
cp backend/auth-service/.env.example backend/auth-service/.env
cp backend/user-service/.env.example backend/user-service/.env
cp backend/document-service/.env.example backend/document-service/.env
cp backend/scoring-service/.env.example backend/scoring-service/.env
cp backend/notification-service/.env.example backend/notification-service/.env

# Create frontend environment
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_DOCUMENT_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_SCORING_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:3005
EOF
```

**Important**: Update the `.env` files with your actual configuration:
- Replace JWT secrets with secure random strings
- Add your AWS credentials for S3
- Configure email/SMS provider credentials
- Update database URLs if needed

### Step 5: Setup Database

```bash
# Start database with Docker
docker-compose up -d

# Wait for database to be ready (about 30 seconds)
sleep 30

# Run database migrations
cd backend/shared
npx prisma migrate dev --name init
npx prisma generate

cd ../..
```

### Step 6: Start All Services

```bash
# Start everything with one command
./scripts/run-all.sh
```

## 🌐 Access the Platform

Once all services are running:

- **Frontend**: http://localhost:3000
- **Auth Service API**: http://localhost:3001/api-docs
- **User Service API**: http://localhost:3002/api-docs  
- **Document Service API**: http://localhost:3003/api-docs
- **Scoring Service API**: http://localhost:3004/api-docs
- **Notification Service API**: http://localhost:3005/api-docs

## 🔧 Manual Installation (Alternative)

If you prefer to set up each service manually:

### 1. Auth Service
```bash
cd backend/auth-service
npm install
npm run dev
```

### 2. User Service  
```bash
cd backend/user-service
npm install
npm run dev
```

### 3. Document Service
```bash
cd backend/document-service
npm install
npm run dev
```

### 4. Scoring Service
```bash
cd backend/scoring-service
npm install
npm run dev
```

### 5. Notification Service
```bash
cd backend/notification-service
npm install
npm run dev
```

### 6. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Configuration Guide

### Database Configuration
Update these environment variables in each service:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### AWS S3 Configuration
For document service:
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
```

### Email Configuration
For notification service:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### JWT Configuration
Generate secure random strings:
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🧪 Testing

Run tests for each service:
```bash
cd backend/auth-service
npm test

cd ../user-service
npm test

# Repeat for other services
```

## 🚀 Production Deployment

### Using Docker
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
```bash
# Build each service
cd backend/auth-service
npm run build

# Repeat for all services

# Build frontend
cd frontend
npm run build
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on specific ports
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database connection failed**
   ```bash
   # Check if PostgreSQL is running
   docker ps
   # Restart database
   docker-compose restart postgres
   ```

3. **Missing dependencies**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Permission errors**
   ```bash
   # Fix script permissions
   chmod +x scripts/*.sh
   ```

### Logs
Check service logs:
```bash
# Service logs
tail -f backend/auth-service/logs/combined.log

# Docker logs
docker-compose logs -f auth-service
```

## 📚 Next Steps

After installation:

1. **Create your first user** via the registration page
2. **Upload test documents** to verify document service
3. **Check API documentation** at `/api-docs` endpoints
4. **Configure external integrations** (AWS, SendGrid, etc.)
5. **Set up monitoring** and alerts for production

## 🆘 Getting Help

- **Documentation**: Check the API docs at each service's `/api-docs` endpoint
- **Logs**: Check service logs for detailed error information
- **Issues**: Create issues in the project repository
- **Community**: Join our community forums for support

---

🎉 **Congratulations!** You now have a fully functional Talaty platform running locally.