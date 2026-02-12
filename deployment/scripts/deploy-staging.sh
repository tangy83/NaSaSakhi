#!/bin/bash

##############################################################################
# NaariSamata Portal - Staging Deployment Script
#
# This script automates deployment to NaSaSakhiFEStg server
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="${DEPLOY_USER:-ubuntu}"
SERVER_HOST="${DEPLOY_HOST:-NaSaSakhiFEStg}"
APP_DIR="/var/www/naarisamata-portal"
BRANCH="main"

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  NaariSamata Portal - Staging Deployment${NC}"
echo -e "${GREEN}================================================${NC}\n"

# Function to print status messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
if [ -z "$DEPLOY_HOST" ]; then
    log_warn "DEPLOY_HOST not set. Using default: NaSaSakhiFEStg"
fi

# Step 1: Test SSH connection
log_info "Testing SSH connection to $SERVER_HOST..."
if ssh -o ConnectTimeout=5 "$SERVER_USER@$SERVER_HOST" "echo 'SSH connection successful'" 2>/dev/null; then
    log_info "✅ SSH connection successful"
else
    log_error "❌ SSH connection failed. Please check your SSH configuration."
    exit 1
fi

# Step 2: Pull latest code
log_info "Pulling latest code from GitHub..."
ssh "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
    set -e
    cd /var/www/naarisamata-portal || exit 1

    echo "📥 Fetching from GitHub..."
    git fetch origin

    echo "🔄 Pulling latest changes..."
    git pull origin main

    echo "✅ Code updated successfully"
ENDSSH

# Step 3: Install dependencies
log_info "Installing dependencies..."
ssh "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
    set -e
    cd /var/www/naarisamata-portal || exit 1

    echo "📦 Installing npm packages..."
    npm install --production=false

    echo "✅ Dependencies installed"
ENDSSH

# Step 4: Run database migrations
log_info "Running database migrations..."
ssh "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
    set -e
    cd /var/www/naarisamata-portal || exit 1

    echo "🗄️  Generating Prisma Client..."
    npx prisma generate

    echo "🗄️  Running migrations..."
    npx prisma migrate deploy

    echo "✅ Database migrations complete"
ENDSSH

# Step 5: Build application
log_info "Building Next.js application..."
ssh "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
    set -e
    cd /var/www/naarisamata-portal || exit 1

    echo "🏗️  Building application..."
    npm run build

    echo "✅ Build complete"
ENDSSH

# Step 6: Restart application
log_info "Restarting application with PM2..."
ssh "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
    set -e
    cd /var/www/naarisamata-portal || exit 1

    echo "🔄 Reloading PM2 processes..."
    pm2 reload all --update-env

    echo "📊 PM2 Status:"
    pm2 status

    echo "✅ Application restarted"
ENDSSH

# Step 7: Health check
log_info "Performing health check..."
sleep 5  # Wait for application to start

if ssh "$SERVER_USER@$SERVER_HOST" "curl -f http://localhost:3000/health" &>/dev/null; then
    log_info "✅ Health check passed"
else
    log_warn "⚠️  Health check failed. Please check application logs."
fi

# Step 8: Show logs
log_info "Recent application logs:"
ssh "$SERVER_USER@$SERVER_HOST" "pm2 logs naarisamata-portal --lines 20 --nostream"

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}  ✅ Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}\n"

echo "📝 Next steps:"
echo "   - Test the application: http://$SERVER_HOST"
echo "   - View logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs'"
echo "   - Monitor status: ssh $SERVER_USER@$SERVER_HOST 'pm2 monit'"

exit 0
