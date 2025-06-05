#!/bin/bash

# Nuclear Git Cleanup for Talaty Platform
# This completely removes large files from git history using multiple methods

set -e

echo "💥 NUCLEAR GIT CLEANUP - Talaty Platform"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Warning
print_error "🚨 NUCLEAR OPTION - This will completely rewrite git history!"
print_error "🚨 This is IRREVERSIBLE and DESTRUCTIVE!"
print_warning "📋 What this script does:"
echo "   1. Completely removes ALL node_modules from history"
echo "   2. Removes ALL large files (>50MB) from history"
echo "   3. Rewrites entire git history"
echo "   4. Creates a clean repository"
echo ""
print_warning "📋 You should:"
echo "   1. Backup your source code files"
echo "   2. Inform all team members"
echo "   3. They will need to re-clone after this"
echo ""

read -p "Type 'NUCLEAR' to proceed (anything else cancels): " confirm
if [ "$confirm" != "NUCLEAR" ]; then
    print_info "Operation cancelled."
    exit 0
fi

echo ""
print_info "🚀 Starting nuclear cleanup..."

# Step 1: Install git-filter-repo if not available
install_git_filter_repo() {
    if ! command -v git-filter-repo &> /dev/null; then
        print_info "Installing git-filter-repo..."
        
        if command -v pip3 &> /dev/null; then
            pip3 install git-filter-repo
        elif command -v pip &> /dev/null; then
            pip install git-filter-repo
        elif command -v brew &> /dev/null; then
            brew install git-filter-repo
        else
            print_warning "Cannot install git-filter-repo automatically"
            print_info "Please install it manually:"
            echo "  pip3 install git-filter-repo"
            echo "  # or"
            echo "  brew install git-filter-repo"
            echo "  # or visit: https://github.com/newren/git-filter-repo"
            exit 1
        fi
        
        print_success "git-filter-repo installed"
    else
        print_success "git-filter-repo already available"
    fi
}

# Method 1: Try git-filter-repo (most effective)
method_1_filter_repo() {
    print_info "Method 1: Using git-filter-repo (recommended)"
    
    install_git_filter_repo
    
    # Remove specific large directories and files
    git filter-repo --force \
        --path node_modules --invert-paths \
        --path-glob '*/node_modules' --invert-paths \
        --path-glob 'frontend/node_modules' --invert-paths \
        --path-glob 'backend/*/node_modules' --invert-paths \
        --path-glob '*.node' --invert-paths \
        --path-glob 'dist' --invert-paths \
        --path-glob 'build' --invert-paths \
        --path-glob '.next' --invert-paths \
        --path-glob 'coverage' --invert-paths \
        --path-glob 'logs' --invert-paths \
        --path package-lock.json --invert-paths \
        --path yarn.lock --invert-paths
    
    print_success "git-filter-repo completed"
}

# Method 2: BFG Repo Cleaner (alternative)
method_2_bfg() {
    print_info "Method 2: Using BFG Repo Cleaner"
    
    # Download BFG if not available
    if [ ! -f "bfg.jar" ]; then
        print_info "Downloading BFG Repo Cleaner..."
        curl -L -o bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
    fi
    
    # Create patterns file
    cat > large-files.txt << 'EOF'
node_modules
*.node
dist
build
.next
coverage
logs
package-lock.json
yarn.lock
EOF
    
    # Run BFG
    java -jar bfg.jar --delete-folders node_modules .
    java -jar bfg.jar --delete-files "*.node" .
    java -jar bfg.jar --strip-blobs-bigger-than 50M .
    
    # Clean up
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    # Clean up files
    rm -f bfg.jar large-files.txt
    
    print_success "BFG cleanup completed"
}

# Method 3: Manual complete reset (nuclear option)
method_3_nuclear_reset() {
    print_info "Method 3: Complete nuclear reset"
    
    # Get current branch
    current_branch=$(git branch --show-current)
    
    # Create new orphan branch
    git checkout --orphan temp-clean-branch
    
    # Add only source files (not node_modules)
    git add .gitignore
    git add README.md
    git add package.json 2>/dev/null || true
    git add backend/*/package.json 2>/dev/null || true
    git add frontend/package.json 2>/dev/null || true
    git add backend/*/src/ 2>/dev/null || true
    git add backend/shared/ 2>/dev/null || true
    git add frontend/src/ 2>/dev/null || true
    git add scripts/ 2>/dev/null || true
    git add docker-compose.yml 2>/dev/null || true
    git add .env.example 2>/dev/null || true
    git add backend/*/.env.example 2>/dev/null || true
    
    # Commit the clean state
    git commit -m "Clean repository - removed all large files and node_modules"
    
    # Delete old branch and rename
    git branch -D $current_branch 2>/dev/null || true
    git branch -m $current_branch
    
    print_success "Nuclear reset completed"
}

# Method 4: Start completely fresh
method_4_fresh_start() {
    print_info "Method 4: Complete fresh start"
    
    # Backup source files
    print_info "Backing up source files..."
    mkdir -p ../talaty-backup
    
    # Copy only source files
    cp -r backend/*/src ../talaty-backup/ 2>/dev/null || true
    cp -r backend/shared ../talaty-backup/ 2>/dev/null || true
    cp -r frontend/src ../talaty-backup/ 2>/dev/null || true
    cp -r scripts ../talaty-backup/ 2>/dev/null || true
    cp *.md ../talaty-backup/ 2>/dev/null || true
    cp package.json ../talaty-backup/ 2>/dev/null || true
    cp backend/*/package.json ../talaty-backup/ 2>/dev/null || true
    cp frontend/package.json ../talaty-backup/ 2>/dev/null || true
    cp docker-compose.yml ../talaty-backup/ 2>/dev/null || true
    cp .env.example ../talaty-backup/ 2>/dev/null || true
    cp backend/*/.env.example ../talaty-backup/ 2>/dev/null || true
    
    print_success "Source files backed up to ../talaty-backup"
    
    # Remove .git and start fresh
    rm -rf .git
    git init
    git branch -m main
    
    # Create .gitignore
    cat > .gitignore << 'EOF'
# Node.js
node_modules/
npm-debug.log*
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local
backend/*/.env
frontend/.env.local

# Build output
dist/
build/
.next/
*.tsbuildinfo

# Logs
logs/
*.log
backend/*/logs/

# Testing
coverage/
.nyc_output/

# IDEs
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Cache
.cache/
.eslintcache

# Uploads
uploads/
temp/
*.tmp

# Keep examples
!.env.example
!backend/*/.env.example
EOF
    
    # Add and commit only source files
    git add .
    git commit -m "Initial commit - clean Talaty platform"
    
    print_success "Fresh repository created"
}

# Create proper .gitignore first
create_gitignore() {
    print_info "Creating comprehensive .gitignore..."
    
    cat > .gitignore << 'EOF'
# Node.js & Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment Variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.local

# Service-specific env files
backend/auth-service/.env
backend/user-service/.env
backend/document-service/.env
backend/scoring-service/.env
backend/notification-service/.env
frontend/.env.local

# Build Output
dist/
build/
out/
.next/
*.tsbuildinfo

# Logs
logs/
*.log
backend/auth-service/logs/
backend/user-service/logs/
backend/document-service/logs/
backend/scoring-service/logs/
backend/notification-service/logs/

# Testing & Coverage
coverage/
*.lcov
.nyc_output/
test-results/

# IDEs & Editors
.vscode/
.idea/
*.swp
*.swo

# Operating Systems
.DS_Store
Thumbs.db
.AppleDouble
.LSOverride

# Cache directories
.cache/
.parcel-cache/
.eslintcache

# Database
*.sqlite
*.sqlite3
*.db
prisma/migrations/

# Docker
docker-compose.override.yml

# Uploads & Temp
uploads/
temp/
tmp/
*.tmp

# Large files that might cause issues
*.node

# Keep these files (exceptions)
!.env.example
!backend/*/.env.example
!README.md
!INSTALLATION.md
!docker-compose.yml
!scripts/*.sh
EOF
    
    print_success ".gitignore created"
}

# Main execution
main() {
    # Create .gitignore first
    create_gitignore
    
    print_info "Choose cleanup method:"
    echo "1) git-filter-repo (recommended, requires installation)"
    echo "2) BFG Repo Cleaner (requires Java)"
    echo "3) Nuclear reset (creates new branch)"
    echo "4) Fresh start (completely new repository)"
    echo ""
    read -p "Enter method number (1-4): " method
    
    case $method in
        1)
            method_1_filter_repo
            ;;
        2)
            method_2_bfg
            ;;
        3)
            method_3_nuclear_reset
            ;;
        4)
            method_4_fresh_start
            ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac
    
    # Final cleanup
    print_info "Performing final cleanup..."
    git reflog expire --expire=now --all 2>/dev/null || true
    git gc --prune=now --aggressive 2>/dev/null || true
    
    # Show results
    echo ""
    print_success "🎉 Cleanup completed!"
    echo ""
    print_info "Repository size:"
    du -sh .git/ 2>/dev/null || echo "Git directory cleaned"
    echo ""
    print_info "Files in repository:"
    git ls-files | head -10
    if [ $(git ls-files | wc -l) -gt 10 ]; then
        echo "... and $(( $(git ls-files | wc -l) - 10 )) more files"
    fi
    echo ""
    print_warning "⚠️  Next steps:"
    echo "1. Add remote if needed: git remote add origin https://github.com/AnasBhr1/Talaty-platform.git"
    echo "2. Force push: git push --force origin main"
    echo "3. Team members must re-clone: git clone [repo-url]"
    echo ""
    print_success "Repository is now clean and ready to push!"
}

# Run main function
main