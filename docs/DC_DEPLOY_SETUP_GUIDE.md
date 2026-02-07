# DC Deploy Setup Guide - Quick Start
## Get your staging environment configured in 30 minutes

**For:** Tanuj (Project Lead)
**When:** Now (Feb 3) - needed by Feb 5 for team
**Time:** 30 minutes to 2 hours depending on existing setup

---

## 🎯 Goal

By the end of this guide, you'll have:
- ✅ Staging server (NaSaSakhiFEStg) configured and accessible
- ✅ Database server (NaSaSakhiDB) running and accessible
- ✅ SSH access for team members
- ✅ Configuration documented and ready to share
- ✅ All workplans updated with actual values

---

## 📋 Prerequisites

Before starting, you need to know:

1. **Do you have DC Deploy servers already?**
   - If YES → Get login credentials for DC Deploy control panel
   - If NO → Need to provision servers first (see Provisioning section)

2. **Who manages your infrastructure?**
   - You → Follow this guide completely
   - Infrastructure team → Request info from them (use templates provided)
   - Hosting provider → Contact for server details

3. **What access do you currently have?**
   - DC Deploy dashboard access
   - Server root/sudo access
   - Database admin access

---

## 🚀 Quick Start (Choose Your Path)

### Path A: You Already Have DC Deploy Servers Running

**Time: ~15 minutes**

1. Run the automated configuration script:
   ```bash
   cd /Users/tanujsaluja/nasa_sakhi
   ./scripts/check-staging-access.sh
   ```

2. Answer the prompts:
   - Server IP/hostname
   - SSH credentials
   - Database connection details
   - Application URL

3. The script will:
   - Test all connections
   - Save configuration to `docs/staging-config.env`
   - Show you quick connect commands

4. Share configuration with team (see "Sharing with Team" section below)

5. Update workplans (I'll help with this after you have the config)

**→ Skip to Step 6: "Share Configuration with Team"**

---

### Path B: Infrastructure Team Manages DC Deploy

**Time: ~5 minutes + waiting for response**

1. Send this email to your infrastructure team:

   ```
   Subject: NASA Sakhi Staging Infrastructure - Need Access Details by Feb 5

   Hi [Infrastructure Team],

   We need access to the staging environment for NASA Sakhi MVP deployment (target: Feb 7).

   Could you please provide the following details by February 5?

   **NaSaSakhiFEStg Application Server:**
   1. Server IP address or hostname
   2. SSH username for deployment user
   3. SSH authentication method (key-based preferred)
   4. Application directory path (e.g., /var/www/nasa_sakhi)
   5. How to restart application (PM2, systemd, other?)
   6. How to view application logs

   **NaSaSakhiDB Database Server:**
   1. PostgreSQL host (IP or hostname)
   2. PostgreSQL port (default 5432)
   3. Database name (suggest: naarisamata_staging)
   4. Database username
   5. Database password
   6. Full connection string

   **Network Access:**
   1. Are servers behind firewall/VPN?
   2. If yes, VPN credentials for team members
   3. Staging application URL (http://<IP> or https://staging.domain.com)

   **Team Members Needing Access:**
   - Akarsha (Backend Developer) - needs SSH + database
   - Sunitha (Frontend Developer) - needs staging URL (SSH optional)
   - Tanuj (Project Lead) - needs SSH + database

   Please let me know if you need SSH public keys from team members.

   Thank you!
   ```

2. Once you receive the response, fill in `docs/DC_DEPLOY_CONFIG.md`

3. Run the verification script:
   ```bash
   ./scripts/check-staging-access.sh
   ```

**→ Skip to Step 6: "Share Configuration with Team"**

---

### Path C: Need to Provision New Servers

**Time: ~1-2 hours**

If you need to set up servers from scratch, follow the detailed guide in `docs/DC_DEPLOY_CONFIG.md`.

**Quick steps:**

1. **Provision Servers**

   **Option 1: Using DC Deploy Control Panel**
   - Log into DC Deploy dashboard
   - Create 2 new instances:
     - `NaSaSakhiFEStg` (2 CPU, 4GB RAM, Ubuntu 22.04)
     - `NaSaSakhiDB` (or use same server for both)
   - Note the IP addresses

   **Option 2: Using Cloud Provider (if DC Deploy is on AWS/Azure/GCP)**
   - Create EC2/VM instances
   - Ubuntu 22.04 LTS
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5432 (PostgreSQL)

2. **Follow Full Setup Guide**
   ```bash
   # Open detailed guide
   open docs/DC_DEPLOY_CONFIG.md

   # Follow Steps 1-8 in that document
   ```

3. **Use Setup Script After Servers Are Running**
   ```bash
   ./scripts/check-staging-access.sh
   ```

---

## 📝 What Information You Need to Collect

Regardless of which path you take, you need these details:

### NaSaSakhiFEStg Server
```yaml
Hostname/IP: ____________________
SSH Username: ____________________
SSH Key Path: ____________________ (or password)
App Directory: ____________________ (e.g., /var/www/nasa_sakhi)
```

### NaSaSakhiDB Database
```yaml
DB Host: ____________________
DB Port: ____________________ (usually 5432)
DB Name: naarisamata_staging
DB User: naarisamata_user
DB Password: ____________________
```

### Application URLs
```yaml
Staging URL: ____________________ (e.g., http://192.168.1.100)
API URL: ${STAGING_URL}/api
```

---

## 🧪 Testing Your Configuration

After collecting the information, test each component:

### 1. Test SSH Access

```bash
# Replace with your actual values
ssh <username>@<server-ip>

# Should connect without password (using SSH key)
# If successful, you'll see server prompt
```

**Troubleshooting:**
- **Connection refused:** Check if server is running, firewall allows port 22
- **Permission denied:** Check SSH key permissions (`chmod 600 ~/.ssh/key_file`)
- **Host unreachable:** Check if you need VPN, verify IP address

### 2. Test Database Connection

```bash
# Install PostgreSQL client if needed
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql-client

# Test connection (replace with your values)
psql "postgresql://naarisamata_user:<PASSWORD>@<DB_IP>:5432/naarisamata_staging"

# Should see: naarisamata_staging=>
# Type \q to exit
```

**Troubleshooting:**
- **Connection refused:** Database port not accessible, use SSH tunnel
- **Password authentication failed:** Wrong password
- **Database does not exist:** Create it first (see DC_DEPLOY_CONFIG.md Step 5)

**Using SSH Tunnel (if direct connection fails):**
```bash
# Create tunnel
ssh -L 5433:<DB_IP>:5432 <username>@<server-ip> -N

# In another terminal
psql "postgresql://naarisamata_user:<PASSWORD>@localhost:5433/naarisamata_staging"
```

### 3. Test Staging URL

```bash
# Test from command line
curl http://<staging-ip>

# Open in browser
open http://<staging-ip>
```

**Troubleshooting:**
- **Connection timeout:** Firewall blocking port 80, or Nginx not running
- **502 Bad Gateway:** Application not running (PM2 down)
- **404 Not Found:** Nginx misconfigured

---

## 👥 Step 6: Share Configuration with Team

Once you have working configuration:

### 1. Load Configuration

```bash
# Configuration saved by the script
source docs/staging-config.env

# Verify variables are set
echo $STAGING_HOST
echo $DATABASE_URL
```

### 2. Create Team Credentials Document

**Option A: Use Password Manager (Recommended)**
- 1Password, LastPass, Bitwarden, etc.
- Create shared vault "NASA Sakhi Staging"
- Add credentials for team

**Option B: Encrypted File**
```bash
# Create credentials file
cat > docs/team-credentials.txt <<EOF
NASA Sakhi Staging Credentials

Server: $STAGING_HOST
Username: $STAGING_USER
Database: $DATABASE_URL
Staging URL: $STAGING_APP_URL

Akarsha's Access:
- SSH: ssh -i ~/.ssh/nasasakhi_shashi $STAGING_USER@$STAGING_HOST
- Database: psql "$DATABASE_URL"

Sunitha's Access:
- Staging URL: $STAGING_APP_URL
- API URL: $STAGING_API_URL
EOF

# Encrypt it
gpg -c docs/team-credentials.txt
# Creates: docs/team-credentials.txt.gpg

# Send encrypted file to team with password separately
```

**Option C: Share via Slack/Email (Less secure, for staging only)**
```
Direct message each team member with their specific credentials
DO NOT post in public channels
```

### 3. Update Workplan Documents

Let me know the actual values, and I'll help update:
- `docs/AKARSHA_WORKPLAN.md`
- `docs/SUNITHA_WORKPLAN.md`
- `docs/MASTER_PROJECT_PLAN.md`

**To update, tell me:**
```
STAGING_HOST="<actual IP or hostname>"
STAGING_USER="<actual username>"
DB_HOST="<actual DB IP>"
DB_PASSWORD="<actual password>"
STAGING_APP_URL="<actual URL>"
```

And I'll replace all placeholders in the documents.

---

## ✅ Verification Checklist

Before sharing with team, verify:

### Server Access
- [ ] Can SSH into NaSaSakhiFEStg without password
- [ ] Server has Node.js 18+ installed (`node --version`)
- [ ] App directory exists and is writable
- [ ] PM2 is installed (`pm2 --version`)
- [ ] Nginx is installed and running (`sudo systemctl status nginx`)

### Database Access
- [ ] Database `naarisamata_staging` exists
- [ ] User `naarisamata_user` can connect
- [ ] User has full privileges on database
- [ ] Connection works from your local machine (or via tunnel)

### Application Deployment
- [ ] Git repository cloned to `/var/www/nasa_sakhi`
- [ ] `.env` file created with correct values
- [ ] `npm install` completes successfully
- [ ] `npx prisma generate` works
- [ ] `npm run build` completes successfully
- [ ] PM2 starts application
- [ ] Nginx serves application on port 80

### Team Access
- [ ] Akarsha can SSH into server
- [ ] Akarsha can connect to database
- [ ] Sunitha can access staging URL from browser
- [ ] All credentials documented and shared securely

---

## 🚨 Common Issues & Solutions

### Issue: Don't know DC Deploy credentials

**Solution:**
1. Check your email for DC Deploy signup confirmation
2. Check password manager for saved credentials
3. Use password reset on DC Deploy website
4. Contact DC Deploy support

### Issue: Servers not provisioned yet

**Solution:**
1. Log into DC Deploy dashboard
2. Go to "Create New Instance" or "Add Server"
3. Select Ubuntu 22.04, 2 CPU, 4GB RAM
4. Wait 5-10 minutes for provisioning
5. Note IP address once ready

### Issue: Can't connect to server (connection timeout)

**Possible causes:**
- Server not running → Start it in DC Deploy dashboard
- Wrong IP address → Double-check from dashboard
- Firewall blocking → Check DC Deploy firewall rules
- Need VPN → Ask infrastructure team

### Issue: SSH permission denied

**Solutions:**
```bash
# Check SSH key permissions
chmod 600 ~/.ssh/your_key
ls -l ~/.ssh/your_key

# Try with verbose output to see error
ssh -v user@host

# Try with password instead of key
ssh -o PubkeyAuthentication=no user@host
```

### Issue: Database doesn't exist

**Solution:**
```bash
# SSH into server
ssh user@server

# Create database
sudo -u postgres psql
CREATE DATABASE naarisamata_staging;
CREATE USER naarisamata_user WITH ENCRYPTED PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE naarisamata_staging TO naarisamata_user;
\q
```

---

## 📞 Need Help?

If you get stuck:

1. **Check detailed guide:** `docs/DC_DEPLOY_CONFIG.md`
2. **Check access checklist:** `docs/DC_DEPLOY_ACCESS_CHECKLIST.md`
3. **Contact DC Deploy support** (if infrastructure issue)
4. **Ask me (Claude)** - describe what you tried and what error you got

---

## ⏭️ Next Steps

After completing setup:

1. ✅ Configuration tested and working
2. ✅ Credentials securely shared with team
3. ✅ Tell me the actual values so I can update workplans
4. ✅ Team members test their access (Akarsha, Sunitha)
5. ✅ Schedule team sync to confirm everyone can access

**Target:** Complete by end of Feb 3 or Feb 4 morning, so team has Feb 4-5 to prepare before Feb 6 integration.

---

**Document Version:** 1.0
**Created:** February 3, 2026
**Quick Start Time:** 15-30 minutes (if servers exist)
