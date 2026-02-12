#!/bin/bash

# NASA Sakhi - Staging Access Verification Script
# This script helps verify and document your DC Deploy staging configuration

set -e

echo "========================================="
echo "NASA Sakhi Staging Access Checker"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration file
CONFIG_FILE="$(dirname "$0")/../docs/staging-config.env"

# Function to prompt for input
prompt() {
    local var_name=$1
    local prompt_text=$2
    local default_value=$3

    if [ -n "$default_value" ]; then
        read -p "$prompt_text [$default_value]: " value
        value=${value:-$default_value}
    else
        read -p "$prompt_text: " value
    fi

    echo "$value"
}

# Function to test connectivity
test_connection() {
    local host=$1
    local port=$2
    local service=$3

    echo -n "Testing $service connection to $host:$port... "

    if command -v nc &> /dev/null; then
        if nc -zv -w5 "$host" "$port" &> /dev/null; then
            echo -e "${GREEN}✓ Success${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed${NC}"
            return 1
        fi
    elif command -v telnet &> /dev/null; then
        if timeout 5 telnet "$host" "$port" &> /dev/null; then
            echo -e "${GREEN}✓ Success${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ Cannot test (nc or telnet not found)${NC}"
        return 2
    fi
}

# Function to test SSH
test_ssh() {
    local user=$1
    local host=$2
    local key=$3

    echo -n "Testing SSH connection as $user@$host... "

    if [ -n "$key" ] && [ -f "$key" ]; then
        if ssh -i "$key" -o ConnectTimeout=5 -o BatchMode=yes "$user@$host" "echo 'SSH OK'" &> /dev/null; then
            echo -e "${GREEN}✓ Success${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed${NC}"
            return 1
        fi
    else
        if ssh -o ConnectTimeout=5 -o BatchMode=yes "$user@$host" "echo 'SSH OK'" &> /dev/null; then
            echo -e "${GREEN}✓ Success${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed (try with password or specify SSH key)${NC}"
            return 1
        fi
    fi
}

# Function to test database
test_database() {
    local connection_string=$1

    echo -n "Testing PostgreSQL database connection... "

    if command -v psql &> /dev/null; then
        if psql "$connection_string" -c "SELECT version();" &> /dev/null; then
            echo -e "${GREEN}✓ Success${NC}"
            return 0
        else
            echo -e "${RED}✗ Failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ Cannot test (psql not found)${NC}"
        return 2
    fi
}

# Main configuration wizard
echo "This script will help you configure and test your DC Deploy staging access."
echo ""
echo "Press Enter to start, or Ctrl+C to cancel."
read

echo ""
echo "=== Step 1: NaSaSakhiFEStg Server Configuration ==="
echo ""

STAGING_HOST=$(prompt "STAGING_HOST" "Enter staging server IP or hostname")
STAGING_USER=$(prompt "STAGING_USER" "Enter SSH username" "deploy")
STAGING_PORT=$(prompt "STAGING_PORT" "Enter SSH port" "22")
APP_DIR=$(prompt "APP_DIR" "Enter application directory" "/var/www/nasa_sakhi")

echo ""
read -p "Do you have an SSH key for this server? (y/n): " has_key
if [ "$has_key" = "y" ]; then
    SSH_KEY=$(prompt "SSH_KEY" "Enter path to SSH private key" "$HOME/.ssh/id_rsa")
else
    SSH_KEY=""
fi

echo ""
echo "=== Step 2: NaSaSakhiDB Database Configuration ==="
echo ""

read -p "Is database on the same server as application? (y/n): " same_server
if [ "$same_server" = "y" ]; then
    DB_HOST="$STAGING_HOST"
else
    DB_HOST=$(prompt "DB_HOST" "Enter database server IP or hostname")
fi

DB_PORT=$(prompt "DB_PORT" "Enter PostgreSQL port" "5432")
DB_NAME=$(prompt "DB_NAME" "Enter database name" "naarisamata_staging")
DB_USER=$(prompt "DB_USER" "Enter database user" "naarisamata_user")
read -sp "Enter database password: " DB_PASSWORD
echo ""

DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

echo ""
echo "=== Step 3: Staging Application URL ==="
echo ""

read -p "Do you have a domain name for staging? (y/n): " has_domain
if [ "$has_domain" = "y" ]; then
    STAGING_APP_URL=$(prompt "STAGING_APP_URL" "Enter staging URL (https://staging.example.com)")
else
    STAGING_APP_URL="http://$STAGING_HOST"
fi

STAGING_API_URL="$STAGING_APP_URL/api"

echo ""
echo "=== Configuration Summary ==="
echo ""
echo "Staging Server: $STAGING_USER@$STAGING_HOST:$STAGING_PORT"
echo "App Directory: $APP_DIR"
echo "Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "Staging URL: $STAGING_APP_URL"
echo ""

read -p "Is this configuration correct? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Configuration cancelled. Please run the script again."
    exit 1
fi

echo ""
echo "=== Running Connectivity Tests ==="
echo ""

# Test staging server SSH
test_connection "$STAGING_HOST" "$STAGING_PORT" "SSH"
if [ -n "$SSH_KEY" ]; then
    test_ssh "$STAGING_USER" "$STAGING_HOST" "$SSH_KEY"
fi

# Test database
test_connection "$DB_HOST" "$DB_PORT" "PostgreSQL"
test_database "$DATABASE_URL"

# Test HTTP
if [ "$STAGING_APP_URL" != "" ]; then
    echo -n "Testing HTTP access to $STAGING_APP_URL... "
    if curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$STAGING_APP_URL" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${YELLOW}⚠ Server not responding (may not be deployed yet)${NC}"
    fi
fi

echo ""
echo "=== Saving Configuration ==="
echo ""

# Save configuration
cat > "$CONFIG_FILE" <<EOF
# NASA Sakhi Staging Configuration
# Generated on $(date)

# NaSaSakhiFEStg Server
export STAGING_HOST="$STAGING_HOST"
export STAGING_USER="$STAGING_USER"
export STAGING_PORT="$STAGING_PORT"
export APP_DIR="$APP_DIR"
export SSH_KEY="$SSH_KEY"

# NaSaSakhiDB Database
export DB_HOST="$DB_HOST"
export DB_PORT="$DB_PORT"
export DB_NAME="$DB_NAME"
export DB_USER="$DB_USER"
export DB_PASSWORD="$DB_PASSWORD"

# Connection Strings
export DATABASE_URL="$DATABASE_URL"

# Staging URLs
export STAGING_APP_URL="$STAGING_APP_URL"
export STAGING_API_URL="$STAGING_API_URL"

# Quick Connect Commands
alias ssh-staging='ssh -i $SSH_KEY $STAGING_USER@$STAGING_HOST'
alias db-staging='psql "$DATABASE_URL"'
alias logs-staging='ssh -i $SSH_KEY $STAGING_USER@$STAGING_HOST "pm2 logs nasa-sakhi --lines 50"'
EOF

echo -e "${GREEN}✓ Configuration saved to: $CONFIG_FILE${NC}"
echo ""
echo "To use this configuration:"
echo "  source $CONFIG_FILE"
echo ""
echo "Quick connect commands (after sourcing config):"
echo "  ssh-staging    # SSH into staging server"
echo "  db-staging     # Connect to staging database"
echo "  logs-staging   # View application logs"
echo ""

echo "=== Next Steps ==="
echo ""
echo "1. Share this configuration with your team securely"
echo "2. Update workplan documents with actual values"
echo "3. Test team member access (Shashi, Sunitha)"
echo "4. Verify deployment workflow"
echo ""
echo "For detailed setup instructions, see:"
echo "  docs/DC_DEPLOY_CONFIG.md"
echo "  docs/DC_DEPLOY_ACCESS_CHECKLIST.md"
echo ""

echo -e "${GREEN}Setup complete!${NC}"
