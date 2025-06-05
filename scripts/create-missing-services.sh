#!/bin/bash

# Create Missing Services for Talaty Platform
# This script creates all missing service files and directories

set -e

echo "🔧 Creating Missing Services for Talaty Platform"
echo "================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Please run this script from the talaty-platform root directory"
    exit 1
fi

# Function to create a service
create_service() {
    local service_name=$1
    local port=$2
    local service_description="$3"
    
    print_info "Creating $service_name..."
    
    # Create directory structure
    mkdir -p "backend/$service_name/src/{controllers,routes,services,validation,config,tests}"
    mkdir -p "backend/$service_name/logs"
    
    # Create package.json
    cat > "backend/$service_name/package.json" << EOF
{
  "name": "talaty-$service_name",
  "version": "1.0.0",
  "description": "$service_description for Talaty platform",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "joi": "^17.11.0",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.16",
    "@types/node": "^20.9.0",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.16",
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.12.0",
    "@typescript-eslint/parser": "^6.12.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

    # Create TypeScript config
    cat > "backend/$service_name/tsconfig.json" << EOF
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
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

    # Create .env.example
    cat > "backend/$service_name/.env.example" << EOF
PORT=$port
NODE_ENV=development
SERVICE_NAME=$service_name

# Database
DATABASE_URL=postgresql://talaty_user:talaty_password@localhost:5432/talaty_${service_name//-/_}?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Other Services URLs
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
DOCUMENT_SERVICE_URL=http://localhost:3003
SCORING_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3005

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Health Check
HEALTH_CHECK_INTERVAL=30000
EOF

    # Create main index.ts
    cat > "backend/$service_name/src/index.ts" << EOF
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || $port;
const SERVICE_NAME = '$service_name';

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: \`Talaty \${SERVICE_NAME.charAt(0).toUpperCase() + SERVICE_NAME.slice(1).replace('-', ' ')}\`,
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      docs: '/api-docs'
    }
  });
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: \`Talaty \${SERVICE_NAME.charAt(0).toUpperCase() + SERVICE_NAME.slice(1).replace('-', ' ')} API\`,
      version: '1.0.0',
      description: \`$service_description API for Talaty platform\`,
    },
    servers: [
      {
        url: \`http://localhost:\${PORT}\`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes will be added here
// app.use('/api/${service_name.replace('-service', '')}', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'ENDPOINT_NOT_FOUND',
    message: \`Endpoint \${req.method} \${req.originalUrl} not found\`,
    service: SERVICE_NAME
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.code || 'INTERNAL_SERVER_ERROR',
    message: error.message || 'An unexpected error occurred',
    service: SERVICE_NAME,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(\`🚀 \${SERVICE_NAME} running on port \${PORT}\`);
  console.log(\`📚 API Documentation: http://localhost:\${PORT}/api-docs\`);
  console.log(\`🔍 Health Check: http://localhost:\${PORT}/health\`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
EOF

    # Create Jest config
    cat > "backend/$service_name/jest.config.js" << EOF
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
EOF

    # Create basic test
    cat > "backend/$service_name/src/tests/$service_name.test.ts" << EOF
import request from 'supertest';
import app from '../index';

describe('$service_name', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.service).toBe('$service_name');
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('should return service information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.service).toContain('Talaty');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.status).toBe('running');
    });
  });

  describe('GET /invalid-endpoint', () => {
    it('should return 404 for invalid endpoints', async () => {
      const response = await request(app)
        .get('/invalid-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('ENDPOINT_NOT_FOUND');
    });
  });
});
EOF

    # Create Dockerfile
    cat > "backend/$service_name/Dockerfile" << EOF
# Multi-stage Dockerfile for $service_name
FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=$port

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

USER nodeuser

EXPOSE $port

CMD ["node", "dist/index.js"]
EOF

    print_success "$service_name created successfully"
}

# Create all missing services
print_info "Creating directory structure..."
mkdir -p backend/{user-service,scoring-service,notification-service}

# Create each service
create_service "user-service" "3002" "User management and profile service"
create_service "scoring-service" "3004" "Business scoring and risk assessment service"  
create_service "notification-service" "3005" "Email and SMS notification service"

# Create shared utilities if missing
print_info "Creating shared utilities..."
mkdir -p backend/shared/{types,utils,middleware,prisma}

if [ ! -f "backend/shared/package.json" ]; then
    cat > "backend/shared/package.json" << EOF
{
  "name": "talaty-shared",
  "version": "1.0.0",
  "description": "Shared utilities and types for Talaty platform",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "express": "^4.18.2",
    "winston": "^3.11.0",
    "joi": "^17.11.0",
    "express-rate-limit": "^7.1.5",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.9.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5.2.2"
  }
}
EOF
fi

# Create basic shared utilities
if [ ! -f "backend/shared/utils/index.ts" ]; then
    cat > "backend/shared/utils/index.ts" << EOF
// Shared utilities for Talaty platform

export const createSuccessResponse = (message: string, data?: any) => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});

export const createErrorResponse = (message: string, error: string, code?: number) => ({
  success: false,
  error,
  message,
  timestamp: new Date().toISOString(),
  ...(code && { code })
});

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};
EOF
fi

# Update run-all.sh to handle missing services gracefully
print_info "Updating run-all.sh script..."

cat > "scripts/run-all.sh" << 'EOF'
#!/bin/bash

# Talaty Platform - Run All Services
# This script starts all backend services and frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Store PIDs of background processes
declare -a PIDS=()

# Function to cleanup on exit
cleanup() {
    echo -e "${YELLOW}[WARNING]${NC} Shutting down all services..."
    
    # Kill all background processes
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${BLUE}[INFO]${NC} Stopping process $pid"
            kill "$pid" 2>/dev/null || true
        fi
    done
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Force kill any remaining processes
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}[WARNING]${NC} Force stopping process $pid"
            kill -9 "$pid" 2>/dev/null || true
        fi
    done
    
    echo -e "${GREEN}[SUCCESS]${NC} All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_service() {
    echo -e "${PURPLE}[SERVICE]${NC} $1"
}

# Function to start a service
start_service() {
    local service_dir=$1
    local service_name=$2
    local port=$3
    
    print_service "Starting $service_name on port $port..."
    
    # Check if service directory exists
    if [ ! -d "backend/$service_dir" ]; then
        print_error "Directory backend/$service_dir not found"
        return 1
    fi
    
    # Navigate to service directory
    cd "backend/$service_dir"
    
    # Check if package.json exists
    if [ ! -f package.json ]; then
        print_error "package.json not found in $service_dir"
        cd ../..
        return 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d node_modules ]; then
        print_info "Installing dependencies for $service_name..."
        npm install
    fi
    
    # Check if dev script exists
    if ! npm run dev --dry-run >/dev/null 2>&1; then
        print_warning "$service_name has no dev script, trying to start directly..."
        node src/index.ts &
    else
        # Start the service in background
        npm run dev > "logs/$service_name.log" 2>&1 &
    fi
    
    local pid=$!
    PIDS+=($pid)
    
    print_success "$service_name started with PID $pid"
    cd ../..
    
    return 0
}

# Function to start frontend
start_frontend() {
    print_service "Starting Frontend (Next.js) on port 3000..."
    
    # Navigate to frontend directory
    if [ ! -d "frontend" ]; then
        print_warning "Frontend directory not found, skipping..."
        return 0
    fi
    
    cd frontend
    
    # Check if package.json exists
    if [ ! -f package.json ]; then
        print_warning "Frontend package.json not found, skipping..."
        cd ..
        return 0
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d node_modules ]; then
        print_info "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    npm run dev > "../logs/frontend.log" 2>&1 &
    local pid=$!
    PIDS+=($pid)
    
    print_success "Frontend started with PID $pid"
    cd ..
    
    return 0
}

# Main execution
main() {
    echo ""
    echo "🚀 Starting Talaty Platform"
    echo "============================"
    echo ""
    
    # Create logs directory
    mkdir -p logs
    mkdir -p backend/auth-service/logs
    mkdir -p backend/user-service/logs
    mkdir -p backend/document-service/logs
    mkdir -p backend/scoring-service/logs
    mkdir -p backend/notification-service/logs
    
    # Check if we're in the right directory
    if [ ! -d "backend" ]; then
        print_error "Please run this script from the talaty-platform root directory"
        exit 1
    fi
    
    # Start database if docker-compose exists
    if [ -f "docker-compose.yml" ]; then
        print_info "Starting database services..."
        if command -v docker-compose &> /dev/null; then
            docker-compose up -d postgres redis
            print_success "Database services started"
            sleep 5  # Wait for databases to be ready
        else
            print_warning "docker-compose not found, skipping database startup"
        fi
    fi
    
    # Start backend services
    print_info "Starting backend services..."
    
    # Define services with their directories and ports
    declare -A services=(
        ["auth-service"]="3001"
        ["user-service"]="3002"
        ["document-service"]="3003"
        ["scoring-service"]="3004"
        ["notification-service"]="3005"
    )
    
    # Start each service
    local services_started=0
    for service in "${!services[@]}"; do
        port=${services[$service]}
        if start_service "$service" "$service" "$port"; then
            services_started=$((services_started + 1))
            sleep 2  # Brief pause between service starts
        else
            print_warning "Failed to start $service, continuing with other services..."
        fi
    done
    
    if [ $services_started -eq 0 ]; then
        print_error "No backend services could be started"
        exit 1
    fi
    
    # Start frontend
    start_frontend
    
    echo ""
    print_success "Talaty Platform is starting up!"
    echo ""
    echo "🌐 Access Points:"
    echo "==============================="
    echo -e "${CYAN}Frontend:${NC}              http://localhost:3000"
    echo -e "${CYAN}Auth Service:${NC}          http://localhost:3001"
    echo -e "${CYAN}User Service:${NC}          http://localhost:3002"
    echo -e "${CYAN}Document Service:${NC}      http://localhost:3003"
    echo -e "${CYAN}Scoring Service:${NC}       http://localhost:3004"
    echo -e "${CYAN}Notification Service:${NC}  http://localhost:3005"
    echo ""
    echo -e "${YELLOW}📚 API Documentation:${NC}"
    echo "  Auth Service:     http://localhost:3001/api-docs"
    echo "  User Service:     http://localhost:3002/api-docs"
    echo "  Document Service: http://localhost:3003/api-docs"
    echo "  Scoring Service:  http://localhost:3004/api-docs"
    echo "  Notification:     http://localhost:3005/api-docs"
    echo ""
    echo -e "${GREEN}📋 Logs are available in:${NC}"
    echo "  Backend services: backend/[service-name]/logs/"
    echo "  Frontend:         logs/frontend.log"
    echo ""
    echo -e "${RED}Press Ctrl+C to stop all services${NC}"
    echo ""
    
    # Keep script running and wait for signals
    while true; do
        sleep 1
        
        # Check if any process has died
        for i in "${!PIDS[@]}"; do
            pid=${PIDS[$i]}
            if ! kill -0 "$pid" 2>/dev/null; then
                print_warning "Process $pid has died"
                unset PIDS[$i]
            fi
        done
        
        # If no processes left, exit
        if [ ${#PIDS[@]} -eq 0 ]; then
            print_error "All processes have died, exiting"
            exit 1
        fi
    done
}

# Run main function
main "$@"
EOF

chmod +x scripts/run-all.sh

print_success "🎉 All missing services created successfully!"
echo ""
print_info "📋 What was created:"
echo "  ✅ user-service (port 3002)"
echo "  ✅ scoring-service (port 3004)"
echo "  ✅ notification-service (port 3005)"
echo "  ✅ Shared utilities"
echo "  ✅ Updated run-all.sh script"
echo ""
print_info "🚀 Next steps:"
echo "  1. Run: ./scripts/run-all.sh"
echo "  2. Services will install dependencies automatically"
echo "  3. Check http://localhost:300X for each service"
echo ""
print_warning "📝 Note: You may need to create .env files from .env.example for each service"