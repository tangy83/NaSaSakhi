# DC Deploy Staging Access Checklist
## NASA Sakhi MVP - Infrastructure Access Setup

**Date:** February 3, 2026
**Deadline:** Required by February 6, 2026 (integration day)
**Owner:** Tanuj (coordinate with infrastructure team)

---

## Executive Summary

Akshara and Sunitha need access to DC Deploy staging infrastructure on **February 6** for integration testing and deployment. This document lists all required credentials and access that must be obtained **by February 5** to avoid blocking integration work.

---

## Required Access Matrix

| Resource | Akshara Needs | Sunitha Needs | Tanuj Needs |
|----------|--------------|---------------|-------------|
| **SSH to NaSaSakhiFEStg** | ✅ Yes (deploy backend) | ⚠️ Optional (deploy frontend) | ⚠️ Optional (QA) |
| **Database (NaSaSakhiDB)** | ✅ Yes (migrations, testing) | ❌ No | ⚠️ Optional (verify data) |
| **Staging URL Access** | ✅ Yes (test API) | ✅ Yes (test frontend) | ✅ Yes (QA testing) |
| **VPN (if behind firewall)** | ✅ Yes (if required) | ✅ Yes (if required) | ✅ Yes (if required) |

---

## 1️⃣ SSH Access to NaSaSakhiFEStg Server

### Required Information

**Request from infrastructure team:**

```yaml
Server Hostname/IP: "<provide IP or hostname>"
SSH Port: "22" (default)
SSH Username: "<e.g., deploy, ubuntu, nasasakhi>"
Authentication: "SSH key or password"
```

### Action Items

**For Infrastructure Team:**

- [ ] Create user accounts for Akshara, Sunitha (optional), Tanuj (optional)
- [ ] Collect SSH public keys from team members
- [ ] Add public keys to `~/.ssh/authorized_keys` on NaSaSakhiFEStg
- [ ] Verify team members can SSH successfully
- [ ] Ensure users have correct permissions for `/var/www/nasa_sakhi` (or app directory)
- [ ] Add users to appropriate groups (`www-data`, `deploy`, etc.)

**For Team Members:**

- [ ] Generate SSH key pair if don't have one:
  ```bash
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/nasasakhi_staging_rsa
  ```
- [ ] Send public key to infrastructure team:
  ```bash
  cat ~/.ssh/nasasakhi_staging_rsa.pub
  ```
- [ ] Test SSH connection once access granted:
  ```bash
  ssh -i ~/.ssh/nasasakhi_staging_rsa <username>@<host>
  ```

### Server Details Template

**Fill this out and share with team by Feb 5:**

```bash
# NaSaSakhiFEStg Server Access
export STAGING_HOST="<IP or hostname>"
export STAGING_USER="<username>"
export STAGING_SSH_KEY="~/.ssh/nasasakhi_staging_rsa"

# Test connection
ssh -i $STAGING_SSH_KEY $STAGING_USER@$STAGING_HOST

# App location on server
export APP_DIR="/var/www/nasa_sakhi"  # Confirm this path
```

---

## 2️⃣ PostgreSQL Database Access (NaSaSakhiDB)

### Required Information

**Request from infrastructure team:**

```yaml
Database Host: "<NaSaSakhiDB IP or hostname>"
Database Port: "5432"
Database Name: "naarisamata_staging"
Database User: "naarisamata_user"
Database Password: "<secure password>"
```

### Action Items

**For Infrastructure Team:**

- [ ] Confirm PostgreSQL is accessible from outside (or requires SSH tunnel)
- [ ] Configure `pg_hba.conf` to allow connections from team IPs
  ```
  host    naarisamata_staging    naarisamata_user    <Akshara_IP>/32    md5
  ```
- [ ] Or document that SSH tunnel is required
- [ ] Provide database credentials securely (encrypted email, password manager)
- [ ] Verify Akshara can connect successfully

**For Akshara:**

- [ ] Receive database credentials
- [ ] Test direct connection:
  ```bash
  psql "postgresql://naarisamata_user:<PASSWORD>@<DB_HOST>:5432/naarisamata_staging"
  ```
- [ ] If direct connection fails, set up SSH tunnel:
  ```bash
  ssh -L 5433:<DB_IP>:5432 <USER>@<STAGING_HOST>
  # Then connect to localhost:5433
  psql "postgresql://naarisamata_user:<PASSWORD>@localhost:5433/naarisamata_staging"
  ```
- [ ] Verify can run migrations:
  ```bash
  npx prisma migrate deploy
  ```

### Database Connection Template

**Fill this out and share with Akshara by Feb 5:**

```bash
# NaSaSakhiDB Database Access
export DB_HOST="<IP or hostname>"
export DB_PORT="5432"
export DB_NAME="naarisamata_staging"
export DB_USER="naarisamata_user"
export DB_PASSWORD="<password>"

# Full connection string
export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

# Test connection
psql "$DATABASE_URL" -c "SELECT version();"

# If direct connection not working, use SSH tunnel:
# ssh -L 5433:$DB_HOST:$DB_PORT <USER>@<STAGING_HOST>
# Then: export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5433/$DB_NAME"
```

---

## 3️⃣ Staging Application URL

### Required Information

**Request from infrastructure team:**

```yaml
Frontend URL: "http://<NaSaSakhiFEStg_IP>" or "https://staging.nasasakhi.org"
API Base URL: "http://<NaSaSakhiFEStg_IP>/api"
Health Check: "http://<NaSaSakhiFEStg_IP>/health"
```

### Action Items

**For Infrastructure Team:**

- [ ] Confirm staging URL is accessible from public internet (or requires VPN)
- [ ] Ensure Nginx is configured and running
- [ ] Ensure firewall allows ports 80 (HTTP) and 443 (HTTPS)
- [ ] Provide domain name if using (staging.nasasakhi.org) or IP address
- [ ] Test URL from external network

**For Team Members:**

- [ ] Test URL accessibility from browser:
  ```bash
  curl http://<STAGING_URL>/health
  curl http://<STAGING_URL>/api/health
  ```
- [ ] If not accessible, request VPN credentials

### Staging URL Template

**Fill this out and share with team by Feb 5:**

```bash
# Staging Application URLs
export STAGING_APP_URL="http://<IP or domain>"
export STAGING_API_URL="$STAGING_APP_URL/api"

# Test accessibility
curl $STAGING_APP_URL/health
curl $STAGING_API_URL/health

# If using HTTPS (with SSL certificate):
# export STAGING_APP_URL="https://staging.nasasakhi.org"
```

---

## 4️⃣ Network Access (VPN/Firewall)

### Required Information

**Check with infrastructure team:**

```yaml
Is server behind firewall: "Yes / No"
VPN required: "Yes / No"
VPN provider: "<e.g., OpenVPN, WireGuard, Cisco AnyConnect>"
VPN server: "<VPN gateway URL>"
```

### Action Items

**For Infrastructure Team:**

- [ ] Determine if servers are behind firewall/VPN
- [ ] If yes, provide VPN credentials to team
- [ ] Alternative: Whitelist team member IPs in firewall
  - Akshara's IP: `<IP address>`
  - Sunitha's IP: `<IP address>`
  - Tanuj's IP: `<IP address>`
- [ ] Provide VPN setup instructions

**For Team Members:**

- [ ] If VPN required, install VPN client
- [ ] Test VPN connection
- [ ] After VPN connected, test server access
- [ ] Document VPN connection steps

### Network Access Template

**Fill this out and share with team by Feb 5:**

```bash
# Network Access
VPN_REQUIRED="<yes/no>"

# If VPN required:
VPN_SERVER="<vpn.example.com>"
VPN_USERNAME="<your-vpn-username>"
VPN_PASSWORD="<your-vpn-password>"

# VPN setup instructions:
# 1. Install OpenVPN: <command>
# 2. Download config: <URL>
# 3. Connect: sudo openvpn --config nasasakhi.ovpn
# 4. Test: ping <STAGING_HOST>

# If IP whitelisting instead:
# Provide your public IP: curl ifconfig.me
# Infrastructure team will whitelist
```

---

## 5️⃣ Application Deployment Details

### Required Information

**Request from infrastructure team:**

```yaml
App directory on server: "<e.g., /var/www/nasa_sakhi>"
App owner user: "<e.g., deploy, www-data>"
Process manager: "<e.g., PM2, systemd, docker>"
Node.js version: "18.x"
Git repository accessible from server: "Yes / No"
```

### Action Items

**For Infrastructure Team:**

- [ ] Confirm app directory path
- [ ] Ensure directory has correct permissions (team can read/write)
- [ ] Confirm process manager (PM2 recommended)
- [ ] Ensure PM2 or systemd service is configured
- [ ] Verify Node.js 18+ installed
- [ ] Verify server can git pull from GitHub repo
- [ ] If private repo, ensure SSH key or deploy token configured

**For Akshara (will deploy backend):**

- [ ] Know app directory: `/var/www/nasa_sakhi`
- [ ] Know how to restart app:
  ```bash
  pm2 reload all
  # or
  sudo systemctl restart nasa-sakhi
  ```
- [ ] Know how to view logs:
  ```bash
  pm2 logs nasa-sakhi
  # or
  sudo journalctl -u nasa-sakhi -f
  ```
- [ ] Test deployment dry-run:
  ```bash
  cd /var/www/nasa_sakhi
  git pull origin integration/mvp
  npm install
  npm run build
  ```

### Deployment Details Template

**Fill this out and share with Akshara by Feb 5:**

```bash
# Application Deployment on NaSaSakhiFEStg
export APP_DIR="/var/www/nasa_sakhi"
export APP_USER="deploy"  # or www-data
export PROCESS_MANAGER="pm2"  # or systemd

# Deployment commands
cd $APP_DIR
git pull origin integration/mvp
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# Restart app
pm2 reload all
# or: sudo systemctl restart nasa-sakhi

# View logs
pm2 logs nasa-sakhi --lines 50
# or: sudo journalctl -u nasa-sakhi -f --lines 50

# Check status
pm2 status
# or: sudo systemctl status nasa-sakhi
```

---

## 6️⃣ Environment Variables on Staging

### Required Information

**Confirm with infrastructure team:**

```yaml
.env file location: "<e.g., /var/www/nasa_sakhi/.env>"
Who manages .env: "<team or infrastructure>"
How to update .env: "<manual edit or deployment script>"
```

### Action Items

**For Infrastructure Team:**

- [ ] Create `.env` file on staging server
- [ ] Populate with staging configuration
- [ ] Ensure correct permissions (readable by app user, not world-readable)
- [ ] Provide sample `.env` template to team

**For Akshara:**

- [ ] Know how to update `.env` if needed
- [ ] Verify `.env` has correct values after deployment
- [ ] Restart app after `.env` changes

### Staging .env Template

**Create this file on NaSaSakhiFEStg at `/var/www/nasa_sakhi/.env`:**

```bash
# Application
NODE_ENV=staging
PORT=3000
NEXT_PUBLIC_APP_URL=http://<NaSaSakhiFEStg_IP>

# Database (NaSaSakhiDB)
DATABASE_URL="postgresql://naarisamata_user:<PASSWORD>@<NaSaSakhiDB_IP>:5432/naarisamata_staging"

# NextAuth.js
NEXTAUTH_URL=http://<NaSaSakhiFEStg_IP>
NEXTAUTH_SECRET="<generate-secret-with-openssl-rand-base64-32>"

# File Upload (local for MVP)
UPLOAD_DIR=/var/www/nasa_sakhi/uploads

# Logging
LOG_LEVEL=info
```

---

## 📋 Pre-Integration Checklist (Complete by Feb 5)

### Infrastructure Team Checklist

- [ ] NaSaSakhiFEStg server provisioned and running
- [ ] NaSaSakhiDB PostgreSQL server running and accessible
- [ ] SSH access configured for Akshara (required)
- [ ] SSH access configured for Sunitha (optional)
- [ ] SSH access configured for Tanuj (optional)
- [ ] Database credentials created and shared
- [ ] Firewall rules configured (ports 22, 80, 443, 5432)
- [ ] VPN access provided (if required)
- [ ] App directory created: `/var/www/nasa_sakhi`
- [ ] PM2 installed and configured
- [ ] Nginx installed and configured
- [ ] `.env` file created with correct values
- [ ] Git repository accessible from server
- [ ] Node.js 18+ installed
- [ ] All credentials shared securely with team

### Akshara's Checklist (by Feb 5)

- [ ] Received SSH credentials for NaSaSakhiFEStg
- [ ] Tested SSH connection successfully
- [ ] Received database credentials for NaSaSakhiDB
- [ ] Tested database connection successfully
- [ ] Verified can run `npx prisma migrate deploy`
- [ ] Know app directory path
- [ ] Know how to restart app (PM2 or systemd commands)
- [ ] Know how to view logs
- [ ] Reviewed [deployment/DEPLOYMENT-GUIDE.md](../deployment/DEPLOYMENT-GUIDE.md)
- [ ] Tested deployment dry-run (if possible)

### Sunitha's Checklist (by Feb 5)

- [ ] Received staging application URL
- [ ] Tested URL accessible from browser
- [ ] Know how to point frontend to staging API
- [ ] (Optional) Received SSH credentials if deploying directly
- [ ] Confirmed with Akshara: Who will deploy frontend?
- [ ] Know how to test on mobile (VPN if needed)

### Tanuj's Checklist (by Feb 5)

- [ ] All credentials collected and shared with team
- [ ] Verified Akshara can SSH and access database
- [ ] Verified Sunitha can access staging URL
- [ ] VPN setup complete (if required)
- [ ] Documented all access in this checklist
- [ ] Team members confirmed they're unblocked for Feb 6

---

## 🚨 What to Do if Access Issues Arise

**Day of Integration (Feb 6):**

1. **Don't wait** - escalate immediately if can't connect
2. **Akshara blocked?** - Contact Tanuj + infrastructure team
3. **Sunitha blocked?** - Akshara can deploy for her
4. **Database unreachable?** - Use SSH tunnel as workaround
5. **SSH not working?** - Use password auth temporarily

**Emergency Contacts:**

```
Tanuj: <email/phone>
Infrastructure Team: <email/phone>
```

**Fallback Plan:**

If staging infrastructure not ready by Feb 6:
- Continue development locally
- Akshara deploys database to Heroku/Railway/Supabase (temporary)
- Sunitha tests with Akshara's local backend
- Deploy to staging on Feb 7 instead
- Adjust demo schedule if needed

---

## 📝 Communication Template

**Email to Infrastructure Team (send by Feb 3-4):**

```
Subject: NASA Sakhi Staging Access Required by Feb 5

Hi [Infrastructure Team],

We need access to the DC Deploy staging environment by February 5th for our
NASA Sakhi MVP integration on February 6.

Required Access:

1. SSH Access to NaSaSakhiFEStg:
   - Users: Akshara (required), Sunitha (optional), Tanuj (optional)
   - Please add our SSH public keys (attached)
   - Confirm app directory path

2. PostgreSQL Database Access (NaSaSakhiDB):
   - User: Akshara (backend developer)
   - Database: naarisamata_staging
   - Please provide connection string

3. Network Access:
   - Is VPN required?
   - If yes, please provide VPN credentials

4. Application Details:
   - App directory path
   - Process manager (PM2/systemd)
   - How to restart application
   - .env file management

5. Staging URL:
   - Public URL or IP address
   - Confirm ports 80/443 accessible

Timeline:
- Feb 5: All access verified and working
- Feb 6: Integration and deployment
- Feb 7: QA and customer demo

Please confirm by Feb 4 that all access will be ready.

Attached:
- Akshara's SSH public key
- Sunitha's SSH public key (optional)
- Tanuj's SSH public key (optional)

Thank you!
```

---

## ✅ Final Verification (Feb 5 EOD)

**Run these commands to verify everything works:**

### Akshara's Verification

```bash
# 1. SSH into staging server
ssh -i ~/.ssh/nasasakhi_staging_rsa $STAGING_USER@$STAGING_HOST
# Expected: Should see server prompt

# 2. Check app directory
ls /var/www/nasa_sakhi
# Expected: Should see project files or empty directory

# 3. Test database connection
psql "$DATABASE_URL" -c "SELECT version();"
# Expected: Should see PostgreSQL version

# 4. Test git access
cd /var/www/nasa_sakhi && git pull origin main
# Expected: Should pull latest code

# 5. Test PM2
pm2 list
# Expected: Should see process list (may be empty)
```

### Sunitha's Verification

```bash
# 1. Test staging URL from browser
curl $STAGING_APP_URL/health
# Expected: HTTP 200 or similar

# 2. (Optional) Test SSH
ssh -i ~/.ssh/nasasakhi_staging_rsa $STAGING_USER@$STAGING_HOST
# Expected: Should see server prompt
```

### Tanuj's Verification

```bash
# 1. Confirm team members verified access
# 2. Test staging URL accessible
curl $STAGING_APP_URL
# Expected: HTTP 200 or 502 (if app not deployed yet)

# 3. Document all credentials in secure password manager
```

**If any verification fails, escalate immediately to infrastructure team.**

---

**Document Version:** 1.0
**Last Updated:** February 3, 2026
**Next Review:** February 5, 2026 (verify all access working)
