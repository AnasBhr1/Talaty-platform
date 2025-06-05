#!/bin/bash

# Git Repository Cleanup Script for Talaty Platform
# This script removes node_modules and other large files from git history

set -e

echo "🧹 Cleaning up Git Repository for Talaty Platform"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This is not a git repository. Please run this script from your project root."
    exit 1
fi

print_warning "This script will:"
print_warning "1. Remove node_modules from git history"
print_warning "2. Remove large files from git history"
print_warning "3. Clean up the repository"
print_warning "4. Force push to remote (this rewrites history)"
echo ""
print_warning "⚠️  This operation is DESTRUCTIVE and will rewrite git history!"
print_warning "⚠️  Make sure you have a backup of your code!"
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Operation cancelled."
    exit 0
fi

echo ""
print_info "Starting cleanup process..."

# Step 1: Create proper .gitignore if it doesn't exist
print_info "Step 1: Creating/updating .gitignore..."

cat > .gitignore << 'EOF'
# Node.js & npm
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

# Specific environment files
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

# IDEs & Editors
.vscode/
.idea/
*.swp
*.swo

# Operating Systems
.DS_Store
Thumbs.db

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

# Cache
.cache/
.eslintcache

# Keep these files
!.env.example
!backend/*/.env.example
!README.md
!docker-compose.yml
!scripts/*.sh
EOF

print_success ".gitignore created/updated"

# Step 2: Remove files from current index
print_info "Step 2: Removing large files from git index..."

# Remove node_modules directories
git rm -r --cached node_modules/ 2>/dev/null || true
git rm -r --cached backend/*/node_modules/ 2>/dev/null || true
git rm -r --cached frontend/node_modules/ 2>/dev/null || true

# Remove other large directories
git rm -r --cached dist/ 2>/dev/null || true
git rm -r --cached build/ 2>/dev/null || true
git rm -r --cached .next/ 2>/dev/null || true
git rm -r --cached coverage/ 2>/dev/null || true
git rm -r --cached logs/ 2>/dev/null || true
git rm -r --cached backend/*/logs/ 2>/dev/null || true
git rm -r --cached backend/*/dist/ 2>/dev/null || true

# Remove environment files
git rm --cached .env 2>/dev/null || true
git rm --cached backend/*/.env 2>/dev/null || true
git rm --cached frontend/.env.local 2>/dev/null || true

# Remove lock files
git rm --cached package-lock.json 2>/dev/null || true
git rm --cached backend/*/package-lock.json 2>/dev/null || true
git rm --cached frontend/package-lock.json 2>/dev/null || true
git rm --cached yarn.lock 2>/dev/null || true
git rm --cached backend/*/yarn.lock 2>/dev/null || true
git rm --cached frontend/yarn.lock 2>/dev/null || true

print_success "Files removed from git index"

# Step 3: Remove files from git history using filter-branch
print_info "Step 3: Removing files from git history (this may take a while)..."

# Use git filter-branch to remove files from history
git filter-branch --force --index-filter '
    git rm -r --cached --ignore-unmatch node_modules/
    git rm -r --cached --ignore-unmatch backend/*/node_modules/
    git rm -r --cached --ignore-unmatch frontend/node_modules/
    git rm -r --cached --ignore-unmatch dist/
    git rm -r --cached --ignore-unmatch build/
    git rm -r --cached --ignore-unmatch .next/
    git rm -r --cached --ignore-unmatch coverage/
    git rm -r --cached --ignore-unmatch logs/
    git rm -r --cached --ignore-unmatch backend/*/logs/
    git rm -r --cached --ignore-unmatch backend/*/dist/
    git rm --cached --ignore-unmatch package-lock.json
    git rm --cached --ignore-unmatch backend/*/package-lock.json
    git rm --cached --ignore-unmatch frontend/package-lock.json
    git rm --cached --ignore-unmatch yarn.lock
    git rm --cached --ignore-unmatch backend/*/yarn.lock
    git rm --cached --ignore-unmatch frontend/yarn.lock
' --prune-empty --tag-name-filter cat -- --all

print_success "Files removed from git history"

# Step 4: Clean up git repository
print_info "Step 4: Cleaning up repository..."

# Remove backup refs
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin

# Expire reflog
git reflog expire --expire=now --all

# Garbage collect
git gc --prune=now --aggressive

print_success "Repository cleaned up"

# Step 5: Add .gitignore to commit
print_info "Step 5: Committing .gitignore..."

git add .gitignore
git commit -m "Add comprehensive .gitignore and remove node_modules from history" || print_info "No changes to commit"

print_success "Changes committed"

# Step 6: Show repository size
print_info "Step 6: Repository information..."

echo ""
echo "Repository size after cleanup:"
du -sh .git/

echo ""
echo "Current repository status:"
git status --porcelain

echo ""
print_info "Files that will be pushed:"
git ls-files | head -20
if [ $(git ls-files | wc -l) -gt 20 ]; then
    echo "... and $(( $(git ls-files | wc -l) - 20 )) more files"
fi

echo ""
print_warning "⚠️  IMPORTANT: You need to force push to update the remote repository"
print_warning "⚠️  This will rewrite history on the remote repository"
echo ""
print_info "To push the cleaned repository:"
echo "  git push --force-with-lease origin main"
echo ""
print_info "Or if that fails:"
echo "  git push --force origin main"
echo ""

print_success "Repository cleanup completed!"
print_info "After pushing, team members should run: git clone [repo-url] (fresh clone)"