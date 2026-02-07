# ⚠️ ARCHIVED - DC Deploy Configuration Planning Document

**This document is ARCHIVED and describes the originally planned infrastructure approach (PM2 + Nginx on self-managed servers).**

**The actual deployment uses DC Deploy PaaS with Docker containers. See [DC_DEPLOY_ACTUAL_CONFIG.md](DC_DEPLOY_ACTUAL_CONFIG.md) for current production configuration.**

---

# DC Deploy Configuration - NASA Sakhi Staging (ORIGINAL PLAN - NOT IMPLEMENTED)
## Fill in the actual values for your infrastructure

**Date:** February 3, 2026
**Status:** ⚠️ ARCHIVED - Not implemented, kept for reference only

---

## 📋 Quick Reference Card

Once filled, this becomes your team's reference for all staging access.

```bash
# === COPY THIS SECTION TO SHARE WITH TEAM ===

# NaSaSakhiFEStg Server
export STAGING_HOST=""  # e.g., "192.168.1.100" or "staging.nasasakhi.com"
export STAGING_USER=""  # e.g., "deploy" or "ubuntu"
export STAGING_PORT="22"
export APP_DIR="/var/www/nasa_sakhi"  # Confirm actual path

# NaSaSakhiDB Database
export DB_HOST=""  # e.g., "192.168.1.101" or "db.nasasakhi.com"
export DB_PORT="5432"
export DB_NAME="naarisamata_staging"
export DB_USER="naarisamata_user"
export DB_PASSWORD=""  # Get from infrastructure team

# Staging URLs
export STAGING_APP_URL=""  # e.g., "http://192.168.1.100" or "https://staging.nasasakhi.org"
export STAGING_API_URL="${STAGING_APP_URL}/api"

# === END COPY SECTION ===
```

---

## Step-by-Step Setup Guide

### Step 1: Identify Your DC Deploy Infrastructure

**Questions to answer:**

1. **Do you have DC Deploy servers already provisioned?**
   - [ ] Yes, servers are running
   - [ ] No, need to provision them
   - [ ] Not sure, need to check

2. **How are the servers accessed?**
   - [ ] Public IP addresses (directly accessible)
   - [ ] Private network (VPN required)
   - [ ] Cloud provider (AWS/Azure/GCP)
   - [ ] On-premises data center

3. **Who manages the infrastructure?**
   - [ ] You (Tanuj)
   - [ ] Infrastructure/DevOps team
   - [ ] Third-party hosting provider
   - Contact: _________________________

---

### Step 2: Gather Server Details

#### NaSaSakhiFEStg (Application Server)

**Find this information from your infrastructure:**

```yaml
# Server Identification
Hostname/IP: "___________________________"
SSH Port: "22" (or custom: ________)
Operating System: "Ubuntu 22.04" (or: ________)

# Access Method
SSH Username: "___________________________"
SSH Authentication:
  - [ ] Password
  - [ ] SSH Key
  - [ ] Both

# Server Specifications (optional, for reference)
CPU: "___________________________"
RAM: "___________________________"
Disk: "___________________________"
```

**How to find this:**

If you have access to DC Deploy dashboard or control panel:
1. Log into DC Deploy control panel
2. Look for "Servers" or "Instances" section
3. Find server named "NaSaSakhiFEStg" or similar
4. Note down the IP address and credentials

If managed by infrastructure team:
```bash
# Send this email/message:
"Hi [Infrastructure Team],

I need access details for the NASA Sakhi staging server (NaSaSakhiFEStg):
- Server IP address or hostname
- SSH username
- SSH authentication method (key or password)
- Current server status (running/stopped)

Thanks!"
```

**Commands to verify (if you already have access):**

```bash
# Test SSH connectivity
ssh <username>@<ip-address>
# Example: ssh deploy@192.168.1.100

# Once logged in, check system info
uname -a  # OS version
hostname  # Server name
df -h     # Disk space
free -m   # Memory
node --version  # Node.js version
pm2 --version   # PM2 installed?
nginx -v  # Nginx version
```

#### NaSaSakhiDB (Database Server)

**Find this information:**

```yaml
# Server Identification
Hostname/IP: "___________________________"
PostgreSQL Port: "5432" (or custom: ________)

# Database Details
Database Name: "naarisamata_staging"
Database User: "naarisamata_user"
Database Password: "___________________________"

# Database Accessibility
Direct Access:
  - [ ] Yes (port 5432 open to internet)
  - [ ] No (requires SSH tunnel)
  - [ ] VPN required

# PostgreSQL Version
Version: "15.x" (or: ________)
```

**How to find this:**

If database is on separate server:
1. Check DC Deploy control panel for database instances
2. Look for PostgreSQL database named similar to "NaSaSakhiDB"
3. Note connection details

If database is on same server as application:
```bash
# SSH into NaSaSakhiFEStg
ssh <username>@<ip-address>

# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL version
psql --version

# List databases (if you have access)
sudo -u postgres psql -l
```

**Commands to verify database connectivity:**

```bash
# From your local machine (if direct access):
psql "postgresql://naarisamata_user:<PASSWORD>@<DB_IP>:5432/naarisamata_staging"

# If connection works, you'll see:
# naarisamata_staging=#

# Test a query:
# SELECT version();
# \l  (list databases)
# \dt (list tables)
# \q  (quit)
```

---

### Step 3: Network Access Configuration

**Questions to answer:**

1. **Can you ping the servers from your local machine?**

   ```bash
   # Test NaSaSakhiFEStg
   ping <STAGING_HOST>
   # Example: ping 192.168.1.100

   # Test NaSaSakhiDB (if separate server)
   ping <DB_HOST>
   ```

   - [ ] Yes, both servers respond to ping
   - [ ] No, ping timeout
   - [ ] Ping blocked by firewall (expected for production servers)

2. **Is VPN required to access servers?**

   - [ ] Yes, VPN required
     - VPN Provider: _________________________
     - VPN Server: _________________________
     - VPN Credentials: _________________________

   - [ ] No, servers are publicly accessible

   - [ ] Not sure, need to check with infrastructure team

3. **Are there any firewall rules?**

   ```bash
   # Check if SSH port is accessible
   telnet <STAGING_HOST> 22
   # or
   nc -zv <STAGING_HOST> 22

   # Check if HTTP/HTTPS ports are accessible
   telnet <STAGING_HOST> 80
   telnet <STAGING_HOST> 443

   # Check if PostgreSQL port is accessible
   telnet <DB_HOST> 5432
   ```

   Results:
   - SSH (port 22): [ ] Open  [ ] Closed  [ ] Filtered
   - HTTP (port 80): [ ] Open  [ ] Closed  [ ] Filtered
   - HTTPS (port 443): [ ] Open  [ ] Closed  [ ] Filtered
   - PostgreSQL (port 5432): [ ] Open  [ ] Closed  [ ] Filtered

---

### Step 4: SSH Key Setup

**For each team member who needs SSH access:**

#### Generate SSH Keys

```bash
# Akarsha's SSH key
ssh-keygen -t rsa -b 4096 -C "shashi@nasasakhi.org" -f ~/.ssh/nasasakhi_shashi

# Sunitha's SSH key (if she needs direct access)
ssh-keygen -t rsa -b 4096 -C "sunitha@nasasakhi.org" -f ~/.ssh/nasasakhi_sunitha

# Tanuj's SSH key
ssh-keygen -t rsa -b 4096 -C "tanuj@nasasakhi.org" -f ~/.ssh/nasasakhi_tanuj
```

#### Collect Public Keys

```bash
# Akarsha's public key
cat ~/.ssh/nasasakhi_shashi.pub

# Copy the output and save it here:
```

**Akarsha's Public Key:**
```
# Paste here:


```

**Sunitha's Public Key (if needed):**
```
# Paste here:


```

**Tanuj's Public Key:**
```
# Paste here:


```

#### Add Public Keys to Server

**Option A: If you have server access already:**

```bash
# SSH into NaSaSakhiFEStg
ssh <current-user>@<STAGING_HOST>

# Add Akarsha's key
echo "<AKARSHA_PUBLIC_KEY>" >> ~/.ssh/authorized_keys

# Or if adding for different user:
sudo su - deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "<AKARSHA_PUBLIC_KEY>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Option B: Request from infrastructure team:**

```
Send to infrastructure team:

"Please add these SSH public keys to the NaSaSakhiFEStg server for user '<username>':

Akarsha's key:
<paste public key>

Sunitha's key (optional):
<paste public key>

Tanuj's key:
<paste public key>

Please confirm once added so we can test connectivity."
```

#### Test SSH Connection

```bash
# Akarsha tests:
ssh -i ~/.ssh/nasasakhi_shashi <username>@<STAGING_HOST>

# Should see server prompt without password
# If successful:
hostname  # Verify correct server
whoami    # Verify correct user
exit

# Add to SSH config for easier access
cat >> ~/.ssh/config <<EOF

Host nasasakhi-staging
    HostName <STAGING_HOST>
    User <username>
    IdentityFile ~/.ssh/nasasakhi_shashi
    Port 22
EOF

# Now can connect simply:
ssh nasasakhi-staging
```

---

### Step 5: Database Access Setup

#### Create Database and User

**If database doesn't exist yet:**

```bash
# SSH into NaSaSakhiDB server (or NaSaSakhiFEStg if same server)
ssh <user>@<DB_HOST>

# Access PostgreSQL as postgres user
sudo -u postgres psql

# Run these SQL commands:
CREATE DATABASE naarisamata_staging;
CREATE USER naarisamata_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE naarisamata_staging TO naarisamata_user;
ALTER DATABASE naarisamata_staging OWNER TO naarisamata_user;

# Exit psql
\q
```

#### Configure PostgreSQL for Remote Access (if on separate server)

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf

# Find and change:
# listen_addresses = 'localhost'
# to:
listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Add line (replace <ALLOWED_IP> with Akarsha's IP or NaSaSakhiFEStg IP):
host    naarisamata_staging    naarisamata_user    <ALLOWED_IP>/32    md5

# Or allow from any IP (less secure, for staging only):
host    naarisamata_staging    naarisamata_user    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check it's listening
sudo netstat -plnt | grep 5432
```

#### Test Database Connection

**From local machine (if port open):**

```bash
# Install PostgreSQL client if needed
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql-client
# Windows: Download from postgresql.org

# Test connection
psql "postgresql://naarisamata_user:<PASSWORD>@<DB_HOST>:5432/naarisamata_staging"

# If successful, you'll see:
# naarisamata_staging=>

# Run test query:
SELECT version();

# Exit
\q
```

**If direct connection fails, use SSH tunnel:**

```bash
# Create SSH tunnel
ssh -L 5433:<DB_HOST>:5432 <user>@<STAGING_HOST> -N

# In another terminal, connect via tunnel
psql "postgresql://naarisamata_user:<PASSWORD>@localhost:5433/naarisamata_staging"
```

---

### Step 6: Application Deployment Setup

#### Verify Directory Structure

```bash
# SSH into NaSaSakhiFEStg
ssh <user>@<STAGING_HOST>

# Check if app directory exists
ls -la /var/www/nasa_sakhi

# If doesn't exist, create it
sudo mkdir -p /var/www/nasa_sakhi

# Set ownership (replace 'deploy' with actual user)
sudo chown -R deploy:deploy /var/www/nasa_sakhi

# Verify permissions
ls -la /var/www/
```

#### Clone Repository

```bash
# Navigate to app directory
cd /var/www/nasa_sakhi

# Clone repository
git clone https://github.com/tangy83/NaSaSakhi.git .

# If private repo, set up SSH key for GitHub
ssh-keygen -t rsa -b 4096 -C "deploy@server" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub
# Add this key to GitHub repo: Settings > Deploy keys

# Or use HTTPS with personal access token
git clone https://<GITHUB_TOKEN>@github.com/tangy83/NaSaSakhi.git .
```

#### Install Dependencies

```bash
# Check Node.js version
node --version  # Should be 18+

# If Node.js not installed or old version:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install dependencies
npm install

# Install PM2 globally (if not installed)
sudo npm install -g pm2
```

#### Create Environment File

```bash
# Create .env file
nano /var/www/nasa_sakhi/.env

# Add configuration (fill in actual values):
NODE_ENV=staging
PORT=3000
NEXT_PUBLIC_APP_URL=http://<STAGING_HOST>

DATABASE_URL="postgresql://naarisamata_user:<DB_PASSWORD>@<DB_HOST>:5432/naarisamata_staging"

NEXTAUTH_URL=http://<STAGING_HOST>
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"

# Save and exit (Ctrl+X, Y, Enter)

# Secure the file
chmod 600 .env
```

#### Test Build

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (if schema exists)
npx prisma migrate deploy
# or just push schema
npx prisma db push

# Build Next.js
npm run build

# Should complete without errors
```

#### Configure PM2

```bash
# Create PM2 ecosystem file
nano /var/www/nasa_sakhi/ecosystem.config.js

# Paste this content:
```

```javascript
module.exports = {
  apps: [{
    name: 'nasa-sakhi',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/nasa_sakhi',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'staging',
      PORT: 3000
    },
    error_file: '/var/log/nasa_sakhi/error.log',
    out_file: '/var/log/nasa_sakhi/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

```bash
# Create log directory
sudo mkdir -p /var/log/nasa_sakhi
sudo chown deploy:deploy /var/log/nasa_sakhi

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Copy and run the command it shows

# Check status
pm2 status
pm2 logs nasa-sakhi --lines 20

# Test app locally
curl http://localhost:3000
# Should return HTML or redirect
```

#### Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/nasa_sakhi

# Paste this content:
```

```nginx
server {
    listen 80;
    server_name <STAGING_HOST>;

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

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nasa_sakhi /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

#### Test Full Setup

```bash
# On server:
curl http://localhost:3000
curl http://localhost:3000/health
pm2 status

# From your local machine:
curl http://<STAGING_HOST>
curl http://<STAGING_HOST>/health

# In browser:
# Navigate to http://<STAGING_HOST>
# Should see your application
```

---

### Step 7: Firewall Configuration

```bash
# Check current firewall status
sudo ufw status

# If inactive, enable it
sudo ufw enable

# Allow SSH (IMPORTANT: do this first!)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# If database on same server and needs external access:
# sudo ufw allow 5432/tcp

# Reload firewall
sudo ufw reload

# Verify rules
sudo ufw status verbose
```

---

### Step 8: Document Final Configuration

**Once everything is working, fill in the actual values:**

```bash
# === FINAL CONFIGURATION ===

# NaSaSakhiFEStg Server
STAGING_HOST="___________________________"  # FILL IN
STAGING_USER="___________________________"  # FILL IN
STAGING_PORT="22"
APP_DIR="/var/www/nasa_sakhi"

# NaSaSakhiDB Database
DB_HOST="___________________________"  # FILL IN (could be same as STAGING_HOST)
DB_PORT="5432"
DB_NAME="naarisamata_staging"
DB_USER="naarisamata_user"
DB_PASSWORD="___________________________"  # FILL IN

# Staging URLs
STAGING_APP_URL="___________________________"  # FILL IN (e.g., http://192.168.1.100)
STAGING_API_URL="${STAGING_APP_URL}/api"

# SSH Connection
# ssh -i ~/.ssh/nasasakhi_<name> ${STAGING_USER}@${STAGING_HOST}

# Database Connection String
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# === END CONFIGURATION ===
```

---

## ✅ Verification Checklist

Before sharing with team, verify:

**Server Access:**
- [ ] Can SSH into NaSaSakhiFEStg without password (using SSH key)
- [ ] App directory exists and has correct permissions
- [ ] Git repository cloned successfully
- [ ] PM2 is running and application is up
- [ ] Nginx is configured and serving the application

**Database Access:**
- [ ] Database `naarisamata_staging` exists
- [ ] User `naarisamata_user` has correct permissions
- [ ] Can connect to database from local machine (or via SSH tunnel)
- [ ] `npx prisma migrate deploy` works

**Network Access:**
- [ ] Staging URL accessible from browser
- [ ] API endpoints respond (test /health, /api/health)
- [ ] Firewall allows required ports (22, 80, 443)
- [ ] VPN configured (if required)

**Team Access:**
- [ ] Akarsha's SSH key added and tested
- [ ] Sunitha's SSH key added (if needed) and tested
- [ ] Database credentials securely shared
- [ ] All team members can access staging URL

---

## 🔄 Next Steps

After completing this configuration:

1. **Update the shared configuration file** (see Step 8)
2. **Share credentials securely** with team (use password manager or encrypted email)
3. **Update workplan documents** with actual values (I'll help with this)
4. **Test deployment workflow** end-to-end
5. **Schedule pre-Feb 6 verification** with Akarsha and Sunitha

---

## 📝 Notes & Issues

**Document any issues encountered:**

```
Date: ___________
Issue: ___________
Resolution: ___________

Date: ___________
Issue: ___________
Resolution: ___________
```

**Important reminders for team:**

```
-
-
-
```

---

**Document Version:** 1.0
**Last Updated:** February 3, 2026
**Next Review:** After completing Step 8
