#!/bin/bash

# Talaty Platform - Run All Services Script
# This script starts all backend services and frontend simultaneously

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Store PIDs of background processes
declare -a PIDS=()

# Function to cleanup on exit
cleanup() {
    print_warning "Shutting down all services..."
    
    # Kill all background processes
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            print_info "Stopping process $pid"
            kill "$pid" 2>/dev/null || true
        fi
    done
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Force kill any remaining processes
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            print_warning "Force stopping process $pid"
            kill -9 "$pid" 2>/dev/null || true
        fi
    done
    
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port $port is already in use"
        return 1
    fi
    return 0
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_info "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url/health" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        if [ $((attempt % 5)) -eq 0 ]; then
            print_info "Still waiting for $service_name... (attempt $attempt/$max_attempts)"
        fi
        
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within expected time"
    return 1
}

# Function to start a service
start_service() {
    local service_dir=$1
    local service_name=$2
    local port=$3
    
    print_service "Starting $service_name on port $port..."
    
    # Check if port is available
    if ! check_port $port; then
        return 1
    fi
    
    # Navigate to service directory
    cd "backend/$service_dir" || {
        print_error "Failed to navigate to backend/$service_dir"
        return 1
    }
    
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
    
    # Start the service in background
    npm run dev > "logs/$service_name.log" 2>&1 &
    local pid=$!
    PIDS+=($pid)
    
    print_success "$service_name started with PID $pid"
    cd ../..
    
    return 0
}

# Function to start frontend
start_frontend() {
    print_service "Starting Frontend (Next.js) on port 3000..."
    
    # Check if port is available
    if ! check_port 3000; then
        return 1
    fi
    
    # Navigate to frontend directory
    cd frontend || {
        print_error "Failed to navigate to frontend directory"
        return 1
    }
    
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
    if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the talaty-platform root directory"
        exit 1
    fi
    
    # Check required tools
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is required but not installed"
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
    for service in "${!services[@]}"; do
        port=${services[$service]}
        if start_service "$service" "$service" "$port"; then
            sleep 2  # Brief pause between service starts
        else
            print_error "Failed to start $service"
            cleanup
            exit 1
        fi
    done
    
    # Start frontend
    if start_frontend; then
        sleep 2
    else
        print_error "Failed to start frontend"
        cleanup
        exit 1
    fi
    
    echo ""
    print_success "All services are starting up!"
    echo ""
    
    # Wait for services to be ready
    print_info "Checking service health..."
    
    # Check backend services
    for service in "${!services[@]}"; do
        port=${services[$service]}
        if ! wait_for_service "http://localhost:$port" "$service"; then
            print_warning "$service may not be fully ready, but continuing..."
        fi
    done
    
    # Wait a bit more for frontend
    sleep 5
    
    echo ""
    echo "🎉 Talaty Platform is running!"
    echo "==============================="
    echo ""
    echo -e "${CYAN}Frontend:${NC}              http://localhost:3000"
    echo -e "${CYAN}Auth Service:${NC}          http://localhost:3001"
    echo -e "${CYAN}User Service:${NC}          http://localhost:3002"
    echo -e "${CYAN}Document Service:${NC}      http://localhost:3003"
    echo -e "${CYAN}Scoring Service:${NC}       http://localhost:3004"
    echo -e "${CYAN}Notification Service:${NC}  http://localhost:3005"
    echo ""
    echo -e "${YELLOW}API Documentation:${NC}"
    echo "  Auth Service:     http://localhost:3001/api-docs"
    echo "  User Service:     http://localhost:3002/api-docs"
    echo "  Document Service: http://localhost:3003/api-docs"
    echo "  Scoring Service:  http://localhost:3004/api-docs"
    echo "  Notification:     http://localhost:3005/api-docs"
    echo ""
    echo -e "${GREEN}Logs are available in:${NC}"
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

# Help function
show_help() {
    echo "Talaty Platform - Run All Services"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  --prod         Run in production mode (not implemented yet)"
    echo "  --dev          Run in development mode (default)"
    echo ""
    echo "This script starts all Talaty platform services:"
    echo "  - PostgreSQL and Redis (via Docker)"
    echo "  - Auth Service (port 3001)"
    echo "  - User Service (port 3002)"
    echo "  - Document Service (port 3003)"
    echo "  - Scoring Service (port 3004)"
    echo "  - Notification Service (port 3005)"
    echo "  - Frontend (port 3000)"
    echo ""
    echo "Press Ctrl+C to stop all services"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    --prod)
        print_warning "Production mode not implemented yet"
        exit 1
        ;;
    --dev|"")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac