# NaariSamata Portal - Staging Deployment Guide

## Infrastructure Overview

- **SaathiDB**: PostgreSQL Database Server
- **SaathiBEStg**: Backend API Server (Next.js API Routes)
- **SaathiFEStg**: Frontend Server (Next.js SSR/Static)

## Deployment Architecture

### Option A: Monolithic Deployment (Recommended for Staging)
Deploy the entire Next.js app on **SaathiFEStg** and connect to **SaathiDB**.
- Simpler setup
- Single deployment pipeline
- Frontend + Backend in one process

### Option B: Split Deployment (Production-Ready)
- **SaathiFEStg**: Frontend only (SSR/Static pages)
- **SaathiBEStg**: API Routes only
- More complex but better scalability

**For staging, we'll use Option A (Monolithic) for simplicity.**

---

## 1️⃣ Database Server Setup (SaathiDB)

### Prerequisites
- Ubuntu/Debian server
- SSH access
- Sudo privileges

### Installation Steps

```bash
# SSH into SaathiDB server
ssh user@SaathiDB

# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL 15
sudo apt install postgresql-15 postgresql-contrib-15 -y

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE naarisamata_staging;
CREATE USER naarisamata_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE naarisamata_staging TO naarisamata_user;
ALTER DATABASE naarisamata_staging OWNER TO naarisamata_user;
\q
EOF

# Configure PostgreSQL for remote connections
sudo nano /etc/postgresql/15/main/postgresql.conf
# Change: listen_addresses = '*'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Add: host    naarisamata_staging    naarisamata_user    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Open firewall (if UFW is enabled)
sudo ufw allow 5432/tcp
```

### Database Connection String
```
postgresql://naarisamata_user:YOUR_PASSWORD@SaathiDB_IP:5432/naarisamata_staging
```

---

## 2️⃣ Application Server Setup (SaathiFEStg)

### Prerequisites
- Ubuntu/Debian server
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

### Step 1: Install Dependencies

```bash
# SSH into SaathiFEStg
ssh user@SaathiFEStg

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/naarisamata-portal
sudo chown $USER:$USER /var/www/naarisamata-portal

# Clone repository
cd /var/www/naarisamata-portal
git clone https://github.com/tangy83/Saathi.git .

# Install dependencies
npm install

# Create .env file
nano .env
```

**Environment Variables for SaathiFEStg (.env):**

```bash
# Application
NODE_ENV=staging
PORT=3000
NEXT_PUBLIC_APP_URL=http://SaathiFEStg_IP:3000

# Database (SaathiDB)
DATABASE_URL="postgresql://naarisamata_user:YOUR_PASSWORD@SaathiDB_IP:5432/naarisamata_staging"

# Existing MySQL Database (for data migration - temporary)
MYSQL_HOST="your-mysql-host"
MYSQL_PORT="3306"
MYSQL_DATABASE="sakhi"
MYSQL_USER="your-mysql-user"
MYSQL_PASSWORD="your-mysql-password"

# NextAuth.js
NEXTAUTH_URL="http://SaathiFEStg_IP:3000"
NEXTAUTH_SECRET="generate-random-secret-here-min-32-chars"

# Google Cloud Translation API (add later)
# GOOGLE_TRANSLATE_API_KEY="your-api-key"

# File Upload (add later)
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_S3_BUCKET=""

# Email Service (add later)
# SENDGRID_API_KEY=""
# EMAIL_FROM="noreply@naarisamata.org"
```

### Step 3: Build Application

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build Next.js
npm run build
```

### Step 4: Configure PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: 'naarisamata-portal',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/naarisamata-portal',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'staging',
      PORT: 3000
    },
    error_file: '/var/log/naarisamata/error.log',
    out_file: '/var/log/naarisamata/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/naarisamata
sudo chown $USER:$USER /var/log/naarisamata

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command output to enable startup
```

### Step 5: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/naarisamata
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name SaathiFEStg_IP;

    # Client max body size (for file uploads)
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

**Enable the site:**

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/naarisamata /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Open firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 3️⃣ Backend Server Setup (SaathiBEStg) - Optional for Staging

**Note:** For staging, you can skip this and use Option A (monolithic deployment). This is here for reference if you want to split services later.

If you want to deploy API routes separately:

```bash
# Same setup as SaathiFEStg, but:
# 1. Set PORT=4000 in .env
# 2. Configure Nginx to proxy only /api/* routes
# 3. Update NEXT_PUBLIC_API_URL to point to this server
```

---

## 4️⃣ Deployment Workflow

### Initial Deployment

```bash
# On your local machine
git push origin main

# On SaathiFEStg
cd /var/www/naarisamata-portal
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload all
```

### Automated Deployment Script

See `deployment/scripts/deploy-staging.sh`

---

## 5️⃣ Post-Deployment Tasks

### Database Setup

```bash
# On SaathiFEStg
cd /var/www/naarisamata-portal

# Seed initial data (languages, service categories)
npx prisma db seed

# Run MySQL data audit
npm run db:audit

# Migrate existing organizations
npm run db:migrate-services
npm run db:migrate-languages
npm run db:migrate-organizations
```

### Create First Admin User

```bash
# Access PostgreSQL
psql "postgresql://naarisamata_user:YOUR_PASSWORD@SaathiDB_IP:5432/naarisamata_staging"

# Insert admin user (update with real values)
INSERT INTO admin_users (id, email, name, role, password_hash, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'admin@naarisamata.org',
  'Admin User',
  'super_admin',
  '$2a$10$HASHED_PASSWORD_HERE', -- Use bcrypt to hash
  true,
  NOW()
);
```

---

## 6️⃣ Monitoring & Logs

### View Application Logs

```bash
# Real-time logs
pm2 logs naarisamata-portal

# Error logs only
pm2 logs naarisamata-portal --err

# View log files
tail -f /var/log/naarisamata/error.log
tail -f /var/log/naarisamata/out.log
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### PM2 Status

```bash
pm2 status
pm2 monit
```

---

## 7️⃣ Health Checks

### Application Health

```bash
curl http://SaathiFEStg_IP/health
curl http://SaathiFEStg_IP/api/health
```

### Database Health

```bash
psql "postgresql://naarisamata_user:YOUR_PASSWORD@SaathiDB_IP:5432/naarisamata_staging" -c "SELECT version();"
```

---

## 8️⃣ Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Configure firewall rules (UFW)
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Restrict PostgreSQL to specific IPs
- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure rate limiting in Nginx
- [ ] Set up automatic security updates
- [ ] Regular database backups

---

## 9️⃣ SSL/TLS Setup (Optional for Staging)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (requires domain name)
sudo certbot --nginx -d staging.naarisamata.org

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 🔟 Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs naarisamata-portal --lines 100

# Check if port 3000 is in use
sudo lsof -i :3000

# Check environment variables
pm2 env 0
```

### Database connection issues

```bash
# Test connectivity
psql "postgresql://naarisamata_user:PASSWORD@SaathiDB_IP:5432/naarisamata_staging"

# Check PostgreSQL is listening
sudo netstat -plnt | grep 5432

# Check firewall
sudo ufw status
```

### Nginx issues

```bash
# Test configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx
sudo systemctl reload nginx
```

---

## 📞 Support

For issues or questions, refer to:
- Project README: `/README.md`
- PRD Document: `/docs/prd.md`
- GitHub Issues: https://github.com/tangy83/Saathi/issues
