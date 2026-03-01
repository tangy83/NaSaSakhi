#!/bin/bash

##############################################################################
# NaariSamata Portal - Server Setup Script
#
# Initial setup for SaathiFEStg server
# Run this ONCE to prepare the server for deployments
##############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Server Setup - SaathiFEStg${NC}"
echo -e "${GREEN}================================================${NC}\n"

# Update system
echo -e "${GREEN}[1/8]${NC} Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo -e "${GREEN}[2/8]${NC} Installing Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install PM2
echo -e "${GREEN}[3/8]${NC} Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo -e "${GREEN}[4/8]${NC} Installing Nginx..."
sudo apt install -y nginx

# Create application directory
echo -e "${GREEN}[5/8]${NC} Creating application directory..."
sudo mkdir -p /var/www/naarisamata-portal
sudo chown $USER:$USER /var/www/naarisamata-portal

# Clone repository
echo -e "${GREEN}[6/8]${NC} Cloning repository..."
cd /var/www/naarisamata-portal
if [ ! -d ".git" ]; then
    git clone https://github.com/tangy83/Saathi.git .
else
    echo "Repository already cloned."
fi

# Create log directory
echo -e "${GREEN}[7/8]${NC} Creating log directory..."
sudo mkdir -p /var/log/naarisamata
sudo chown $USER:$USER /var/log/naarisamata

# Configure firewall
echo -e "${GREEN}[8/8]${NC} Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}  ✅ Server Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}\n"

echo "📝 Next steps:"
echo "   1. Create .env file in /var/www/naarisamata-portal"
echo "   2. Install dependencies: cd /var/www/naarisamata-portal && npm install"
echo "   3. Set up PM2: pm2 start ecosystem.config.js"
echo "   4. Configure Nginx: sudo nano /etc/nginx/sites-available/naarisamata"
echo "   5. Run deployment script from your local machine"

exit 0
