#!/bin/bash

# Talaty Platform Setup Script
# This script sets up the complete Talaty platform (backend + frontend)

set -e  # Exit on any error

echo "🚀 Setting up Talaty Platform..."
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
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

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Some features may not work."
        return 1
    fi
    
    if ! docker info &> /dev/null; then
        print_warning "Docker is not running. Please start Docker."
        return 1
    fi
    
    print_success "Docker is installed and running"
    return 0
}

# Create project structure
create_structure() {
    print_status "Creating project structure..."
    
    # Create main directories
    mkdir -p talaty-platform/{backend,frontend,scripts,logs}
    
    # Create backend service directories
    mkdir -p talaty-platform/backend/{shared/{types,utils,middleware,prisma},auth-service,user-service,document-service,scoring-service,notification-service,api-gateway}
    
    # Create frontend directories
    mkdir -p talaty-platform/frontend/src/{app,components,lib,types}
    
    # Create subdirectories for each service
    for service in auth-service user-service document-service scoring-service notification-service; do
        mkdir -p talaty-platform/backend/$service/{src/{controllers,routes,services,validation,config,tests},logs}
    done
    
    print_success "Project structure created"
}

# Setup backend services
setup_backend() {
    print_status "Setting up backend services..."
    
    cd talaty-platform/backend
    
    # Setup shared module
    print_status "Setting up shared utilities..."
    cd shared
    npm init -y
    npm install express @types/express typescript @types/node prisma @prisma/client bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken winston joi express-rate-limit
    cd ..
    
    # Setup each service
    for service in auth-service user-service document-service scoring-service notification-service; do
        print_status "Setting up $service..."
        cd $service
        
        # Copy package.json if it doesn't exist
        if [ ! -f package.json ]; then
            cat > package.json << EOF
{
  "name": "talaty-$service",
  "version": "1.0.0",
  "description": "$service for Talaty platform",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
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
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.16",
    "@types/node": "^20.9.0",
    "typescript": "^5.2.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "ts-jest": "^29.1.1"
  }
}
EOF
        fi
        
        # Install dependencies
        npm install
        
        # Create TypeScript config if it doesn't exist
        if [ ! -f tsconfig.json ]; then
            cat > tsconfig.json << EOF
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
        fi
        
        # Create basic index.ts if it doesn't exist
        if [ ! -f src/index.ts ]; then
            mkdir -p src
            cat > src/index.ts << EOF
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({
    service: '$service',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    service: '$service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 $service running on port \${PORT}\`);
});
EOF
        fi
        
        cd ..
    done
    
    cd ..
    print_success "Backend services setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd talaty-platform/frontend
    
    # Create Next.js app if it doesn't exist
    if [ ! -f package.json ]; then
        npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
        
        # Install additional dependencies
        npm install react-hook-form @hookform/resolvers zod framer-motion axios lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast @radix-ui/react-progress clsx tailwind-merge
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Create .env files for each service
    cd talaty-platform/backend
    
    # Auth service
    cat > auth-service/.env << EOF
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://talaty_user:talaty_password@localhost:5432/talaty_auth?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-byte-hex-encryption-key-change-in-production
EOF

    # User service
    cat > user-service/.env << EOF
PORT=3002
NODE_ENV=development
DATABASE_URL=postgresql://talaty_user:talaty_password@localhost:5432/talaty_user?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF

    # Document service
    cat > document-service/.env << EOF
PORT=3003
NODE_ENV=development
DATABASE_URL=postgresql://talaty_user:talaty_password@localhost:5432/talaty_document?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
S3_BUCKET_NAME=talaty-documents
MAX_FILE_SIZE=10485760
EOF

    # Scoring service
    cat > scoring-service/.env << EOF
PORT=3004
NODE_ENV=development
DATABASE_URL=postgresql://talaty_user:talaty_password@localhost:5432/talaty_scoring?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF

    # Notification service
    cat > notification-service/.env << EOF
PORT=3005
NODE_ENV=development
DATABASE_URL=postgresql://talaty_user:talaty_password@localhost:5432/talaty_notification?schema=public
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF
    
    # Frontend environment
    cd ../frontend
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_DOCUMENT_SERVICE_URL=http://localhost:3003
NEXT_PUBLIC_SCORING_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:3005
EOF
    
    cd ../..
    print_success "Environment files created"
}

# Setup database with Docker
setup_database() {
    print_status "Setting up PostgreSQL database..."
    
    cd talaty-platform
    
    # Create docker-compose.yml for databases
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: talaty_user
      POSTGRES_PASSWORD: talaty_password
      POSTGRES_DB: talaty_main
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-databases.sql:/docker-entrypoint-initdb.d/init-databases.sql
    networks:
      - talaty-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - talaty-network

volumes:
  postgres_data:
  redis_data:

networks:
  talaty-network:
    driver: bridge
EOF

    # Create database initialization script
    mkdir -p scripts
    cat > scripts/init-databases.sql << EOF
-- Create databases for each service
CREATE DATABASE talaty_auth;
CREATE DATABASE talaty_user;
CREATE DATABASE talaty_document;
CREATE DATABASE talaty_scoring;
CREATE DATABASE talaty_notification;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE talaty_auth TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_user TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_document TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_scoring TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_notification TO talaty_user;
EOF
    
    if check_docker; then
        print_status "Starting database containers..."
        docker-compose up -d postgres redis
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        print_success "Database containers started"
    else
        print_warning "Docker not available. Please set up PostgreSQL manually."
    fi
    
    cd ..
}

# Setup Prisma schemas
setup_prisma() {
    print_status "Setting up Prisma schemas..."
    
    cd talaty-platform/backend/shared
    
    # Create Prisma directory and schema
    mkdir -p prisma
    
    # Copy the schema file (this would need to be created separately)
    print_status "Prisma schema should be manually copied to backend/shared/prisma/schema.prisma"
    
    cd ../../..
}

# Create run scripts
create_run_scripts() {
    print_status "Creating run scripts..."
    
    cd talaty-platform/scripts
    
    # Development script
    cat > dev.sh << EOF
#!/bin/bash

# Development script to run all services
echo "🚀 Starting Talaty Platform in development mode..."

# Function to run service in background
run_service() {
    local service=\$1
    local port=\$2
    echo "Starting \$service on port \$port..."
    cd ../backend/\$service
    npm run dev &
    cd - > /dev/null
}

# Start backend services
run_service "auth-service" "3001"
run_service "user-service" "3002"
run_service "document-service" "3003"
run_service "scoring-service" "3004"
run_service "notification-service" "3005"

# Start frontend
echo "Starting frontend on port 3000..."
cd ../frontend
npm run dev &
cd - > /dev/null

echo "✅ All services started!"
echo "Frontend: http://localhost:3000"
echo "Auth Service: http://localhost:3001"
echo "User Service: http://localhost:3002"
echo "Document Service: http://localhost:3003"
echo "Scoring Service: http://localhost:3004"
echo "Notification Service: http://localhost:3005"

# Wait for user input to stop
echo "Press Ctrl+C to stop all services"
wait
EOF

    # Production script
    cat > prod.sh << EOF
#!/bin/bash

echo "🚀 Starting Talaty Platform in production mode..."

# Build all services
echo "Building services..."
cd ../backend
for service in auth-service user-service document-service scoring-service notification-service; do
    echo "Building \$service..."
    cd \$service
    npm run build
    cd ..
done

# Build frontend
echo "Building frontend..."
cd ../frontend
npm run build
cd ..

# Start with PM2 or Docker
echo "Starting services..."
# This would typically use PM2 or Docker Compose for production
EOF

    # Stop script
    cat > stop.sh << EOF
#!/bin/bash

echo "🛑 Stopping Talaty Platform..."

# Kill all node processes (be careful with this in production)
pkill -f "node.*talaty"
pkill -f "npm run dev"
pkill -f "next"

echo "✅ All services stopped"
EOF

    # Make scripts executable
    chmod +x dev.sh prod.sh stop.sh
    
    cd ../..
    print_success "Run scripts created"
}

# Create installation instructions
create_instructions() {
    print_status "Creating setup instructions..."
    
    cd talaty-platform
    
    cat > README.md << EOF
# Talaty Platform

A complete microservices platform for SMB business verification and scoring.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- AWS Account (for S3)

### Installation

1. **Clone and setup:**
   \`\`\`bash
   # Run the setup script
   ./scripts/setup.sh
   \`\`\`

2. **Configure environment variables:**
   - Update \`.env\` files in each service directory
   - Set up AWS credentials for S3
   - Configure email/SMS providers

3. **Start database:**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

4. **Run migrations:**
   \`\`\`bash
   cd backend/shared
   npx prisma migrate dev
   \`\`\`

5. **Start all services:**
   \`\`\`bash
   ./scripts/dev.sh
   \`\`\`

### Services

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **User Service**: http://localhost:3002  
- **Document Service**: http://localhost:3003
- **Scoring Service**: http://localhost:3004
- **Notification Service**: http://localhost:3005

### API Documentation

Each service provides Swagger documentation at \`/api-docs\` endpoint.

### Testing

Run tests for each service:
\`\`\`bash
cd backend/[service-name]
npm test
\`\`\`

### Production Deployment

1. **Build all services:**
   \`\`\`bash
   ./scripts/prod.sh
   \`\`\`

2. **Deploy with Docker:**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

## Architecture

### Backend Services
- **Auth Service**: Authentication, JWT tokens, password reset
- **User Service**: Profile management, eKYC status tracking  
- **Document Service**: File upload, S3 integration, document verification
- **Scoring Service**: Business scoring algorithm, creditworthiness
- **Notification Service**: Email/SMS notifications

### Frontend
- **Next.js 14**: Server-side rendering, API routes
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form management
- **Framer Motion**: Animations

### Database
- **PostgreSQL**: Primary database
- **Prisma**: ORM and migrations
- **Redis**: Session storage and caching

### External Services
- **AWS S3**: Document storage
- **SendGrid/Twilio**: Email/SMS notifications
- **External APIs**: Business verification, address validation

## Security Features
- JWT authentication with refresh tokens
- Rate limiting
- File type validation
- S3 pre-signed URLs
- Input sanitization
- CORS protection
- Helmet security headers

## Development

### Adding a new service
1. Create service directory
2. Copy package.json template
3. Implement controllers and routes
4. Add to docker-compose.yml
5. Update API gateway routes

### Environment Variables
All services use environment variables for configuration. Copy \`.env.example\` to \`.env\` and update values.

### Database Migrations
\`\`\`bash
cd backend/shared
npx prisma migrate dev --name migration_name
\`\`\`

## Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 3000-3005 are available
2. **Database connection**: Ensure PostgreSQL is running
3. **AWS credentials**: Verify S3 access keys
4. **File permissions**: Ensure scripts are executable

### Logs
Check service logs in \`backend/[service]/logs/\` directory.

## Contributing
1. Fork the repository
2. Create feature branch
3. Add tests
4. Submit pull request

## License
MIT License
EOF
    
    print_success "Setup instructions created"
}

# Main execution
main() {
    echo "Starting Talaty Platform setup..."
    
    # Check prerequisites
    check_node
    
    # Setup project
    create_structure
    setup_backend
    setup_frontend
    setup_environment
    setup_database
    setup_prisma
    create_run_scripts
    create_instructions
    
    print_success "🎉 Talaty Platform setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Update environment variables in .env files"
    echo "2. Configure AWS S3 credentials"
    echo "3. Run: cd talaty-platform && ./scripts/dev.sh"
    echo ""
    echo "Visit http://localhost:3000 when all services are running"
}

# Run main function
main "$@"