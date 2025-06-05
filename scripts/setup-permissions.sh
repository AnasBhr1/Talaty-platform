#!/bin/bash

# Setup script permissions for Talaty Platform
# This script fixes all permission issues

echo "🔧 Setting up script permissions for Talaty Platform..."

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Make all scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

# If scripts don't exist yet, create them with proper permissions
if [ ! -f scripts/run-all.sh ]; then
    echo "📝 Creating run-all.sh script..."
    cat > scripts/run-all.sh << 'EOF'
#!/bin/bash

# Talaty Platform - Run All Services
# This script starts all backend services and frontend

echo "🚀 Starting Talaty Platform..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the talaty-platform root directory"
    exit 1
fi

# Function to start a service
start_service() {
    local service_dir=$1
    local service_name=$2
    local port=$3
    
    echo "🔄 Starting $service_name on port $port..."
    
    if [ -d "backend/$service_dir" ]; then
        cd "backend/$service_dir"
        
        if [ -f "package.json" ]; then
            # Install dependencies if needed
            if [ ! -d "node_modules" ]; then
                echo "📦 Installing dependencies for $service_name..."
                npm install
            fi
            
            # Start the service
            echo "▶️  Starting $service_name..."
            npm run dev &
            echo "✅ $service_name started"
        else
            echo "⚠️  No package.json found in $service_dir"
        fi
        
        cd ../..
    else
        echo "⚠️  Directory backend/$service_dir not found"
    fi
}

# Start database if docker-compose exists
if [ -f "docker-compose.yml" ]; then
    echo "🗄️  Starting database services..."
    docker-compose up -d postgres redis || echo "⚠️  Docker services not started (optional)"
fi

# Start backend services
echo ""
echo "🔧 Starting Backend Services..."
start_service "auth-service" "Auth Service" "3001"
sleep 2
start_service "user-service" "User Service" "3002"
sleep 2
start_service "document-service" "Document Service" "3003"
sleep 2
start_service "scoring-service" "Scoring Service" "3004"
sleep 2
start_service "notification-service" "Notification Service" "3005"
sleep 2

# Start frontend
echo ""
echo "🎨 Starting Frontend..."
if [ -d "frontend" ]; then
    cd frontend
    
    if [ -f "package.json" ]; then
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing frontend dependencies..."
            npm install
        fi
        
        echo "▶️  Starting frontend..."
        npm run dev &
        echo "✅ Frontend started"
    else
        echo "⚠️  No package.json found in frontend"
    fi
    
    cd ..
else
    echo "⚠️  Frontend directory not found"
fi

echo ""
echo "🎉 Talaty Platform is starting up!"
echo "================================="
echo "Frontend:              http://localhost:3000"
echo "Auth Service:          http://localhost:3001"
echo "User Service:          http://localhost:3002"
echo "Document Service:      http://localhost:3003"
echo "Scoring Service:       http://localhost:3004"
echo "Notification Service:  http://localhost:3005"
echo ""
echo "API Documentation:"
echo "Auth:     http://localhost:3001/api-docs"
echo "User:     http://localhost:3002/api-docs"
echo "Document: http://localhost:3003/api-docs"
echo "Scoring:  http://localhost:3004/api-docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running
wait
EOF
    chmod +x scripts/run-all.sh
fi

if [ ! -f scripts/test-all.sh ]; then
    echo "📝 Creating test-all.sh script..."
    cat > scripts/test-all.sh << 'EOF'
#!/bin/bash

# Talaty Platform - Test All Services
# This script runs comprehensive tests

echo "🧪 Running Talaty Platform Tests..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

print_failure() {
    echo -e "${RED}[FAIL]${NC} $1"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test service health
test_health() {
    local service=$1
    local port=$2
    
    echo "Testing $service health..."
    if curl -f -s "http://localhost:$port/health" >/dev/null 2>&1; then
        print_success "$service is healthy"
    else
        print_failure "$service health check failed"
    fi
}

# Run unit tests
test_service() {
    local service_dir=$1
    local service_name=$2
    
    echo "Testing $service_name..."
    if [ -d "backend/$service_dir" ]; then
        cd "backend/$service_dir"
        if [ -f "package.json" ] && grep -q '"test"' package.json; then
            if npm test >/dev/null 2>&1; then
                print_success "$service_name tests passed"
            else
                print_failure "$service_name tests failed"
            fi
        else
            print_warning "$service_name has no tests configured"
        fi
        cd ../..
    else
        print_warning "$service_name directory not found"
    fi
}

echo "🔍 Health Checks..."
test_health "Auth Service" "3001"
test_health "User Service" "3002"
test_health "Document Service" "3003"
test_health "Scoring Service" "3004"
test_health "Notification Service" "3005"

echo ""
echo "🧪 Unit Tests..."
test_service "auth-service" "Auth Service"
test_service "user-service" "User Service"
test_service "document-service" "Document Service"
test_service "scoring-service" "Scoring Service"
test_service "notification-service" "Notification Service"

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed.${NC}"
    exit 1
fi
EOF
    chmod +x scripts/test-all.sh
fi

if [ ! -f scripts/stop-all.sh ]; then
    echo "📝 Creating stop-all.sh script..."
    cat > scripts/stop-all.sh << 'EOF'
#!/bin/bash

# Talaty Platform - Stop All Services

echo "🛑 Stopping Talaty Platform..."

# Kill Node.js processes
echo "Stopping Node.js services..."
pkill -f "npm run dev" || true
pkill -f "next" || true
pkill -f "node.*dist" || true

# Stop Docker services
if [ -f "docker-compose.yml" ]; then
    echo "Stopping Docker services..."
    docker-compose down || true
fi

echo "✅ All services stopped"
EOF
    chmod +x scripts/stop-all.sh
fi

# Fix permissions for any existing scripts
echo "🔧 Setting execute permissions on all scripts..."
find scripts -name "*.sh" -exec chmod +x {} \;

echo "✅ All script permissions set successfully!"
echo ""
echo "🚀 You can now run:"
echo "   ./scripts/run-all.sh    # Start all services"
echo "   ./scripts/test-all.sh   # Run all tests"
echo "   ./scripts/stop-all.sh   # Stop all services"