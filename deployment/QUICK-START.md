# 🚀 Quick Start - Staging Deployment

## Server Requirements Summary

### 1️⃣ NaSaSakhiDB (Database Server)

**OS:** Ubuntu 20.04+ / Debian 11+
**RAM:** Minimum 2GB, Recommended 4GB
**Storage:** 20GB SSD
**Software:**
- PostgreSQL 15
- UFW Firewall

**Commands to Run:**
```bash
# Install PostgreSQL
sudo apt update && sudo apt install postgresql-15 postgresql-contrib-15 -y

# Create database
sudo -u postgres psql -c "CREATE DATABASE naarisamata_staging;"
sudo -u postgres psql -c "CREATE USER naarisamata_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE naarisamata_staging TO naarisamata_user;"

# Enable remote access
sudo nano /etc/postgresql/15/main/postgresql.conf
# Set: listen_addresses = '*'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Add: host    naarisamata_staging    naarisamata_user    0.0.0.0/0    md5

# Restart
sudo systemctl restart postgresql
sudo ufw allow 5432/tcp
```

**Connection String:**
```
postgresql://naarisamata_user:YOUR_PASSWORD@DB_SERVER_IP:5432/naarisamata_staging
```

---

### 2️⃣ NaSaSakhiFEStg (Application Server)

**OS:** Ubuntu 20.04+ / Debian 11+
**RAM:** Minimum 2GB, Recommended 4GB
**CPU:** 2+ cores recommended
**Storage:** 20GB SSD
**Software:**
- Node.js 18.x
- PM2 (process manager)
- Nginx (reverse proxy)
- Git

**Initial Setup Commands:**
```bash
# 1. Copy setup script to server
scp deployment/scripts/setup-server.sh user@SERVER_IP:~/

# 2. SSH into server and run
ssh user@SERVER_IP
chmod +x setup-server.sh
./setup-server.sh
```

**Manual Setup (if script doesn't work):**
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone repository
sudo mkdir -p /var/www/naarisamata-portal
sudo chown $USER:$USER /var/www/naarisamata-portal
cd /var/www/naarisamata-portal
git clone https://github.com/tangy83/NaSaSakhi.git .
```

**Environment Variables (.env):**
Create `/var/www/naarisamata-portal/.env`:
```bash
NODE_ENV=staging
PORT=3000
DATABASE_URL="postgresql://naarisamata_user:PASSWORD@DB_IP:5432/naarisamata_staging"
NEXTAUTH_URL="http://YOUR_SERVER_IP:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

**Build and Start:**
```bash
cd /var/www/naarisamata-portal
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions
```

**Nginx Configuration:**
```bash
# Copy nginx config
sudo cp deployment/nginx.conf /etc/nginx/sites-available/naarisamata
sudo ln -s /etc/nginx/sites-available/naarisamata /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 3️⃣ NaSaSakhiBEStg (Backend - Optional for Staging)

**For staging, you can skip this server.** Use NaSaSakhiFEStg for both frontend and backend.

For production, if you want to split:
- Same setup as NaSaSakhiFEStg
- Configure to serve only `/api/*` routes
- Update frontend to use this backend URL

---

## 🔐 Required Credentials

Before deployment, prepare these:

1. **PostgreSQL Password** - Generate with:
   ```bash
   openssl rand -base64 24
   ```

2. **NextAuth Secret** - Generate with:
   ```bash
   openssl rand -base64 32
   ```

3. **MySQL Credentials** (for data migration):
   - MYSQL_HOST
   - MYSQL_DATABASE (sakhi)
   - MYSQL_USER
   - MYSQL_PASSWORD

4. **SSH Access** to all three servers

---

## 📝 Deployment Checklist

- [ ] **NaSaSakhiDB**: PostgreSQL installed and accessible
- [ ] **NaSaSakhiDB**: Database created with proper user
- [ ] **NaSaSakhiDB**: Firewall allows port 5432 from app server
- [ ] **NaSaSakhiFEStg**: Node.js 18+ installed
- [ ] **NaSaSakhiFEStg**: PM2 installed globally
- [ ] **NaSaSakhiFEStg**: Nginx installed and running
- [ ] **NaSaSakhiFEStg**: Repository cloned to `/var/www/naarisamata-portal`
- [ ] **NaSaSakhiFEStg**: `.env` file created with all variables
- [ ] **NaSaSakhiFEStg**: Application built successfully
- [ ] **NaSaSakhiFEStg**: PM2 running the application
- [ ] **NaSaSakhiFEStg**: Nginx configured as reverse proxy
- [ ] **Network**: Database accessible from app server
- [ ] **Network**: Application accessible from your browser
- [ ] **Network**: Firewall rules configured (80, 443, 5432)

---

## 🚀 Quick Deploy

Once servers are set up, deploy updates with:

```bash
# From your local machine
cd /Users/tanujsaluja/nasa_sakhi

# Set environment variables
export DEPLOY_HOST="YOUR_SERVER_IP_OR_HOSTNAME"
export DEPLOY_USER="your-ssh-user"

# Run deployment script
./deployment/scripts/deploy-staging.sh
```

---

## 🧪 Testing

After deployment, test:

```bash
# Health check
curl http://YOUR_SERVER_IP/health

# Home page
curl http://YOUR_SERVER_IP/

# API test (when implemented)
curl http://YOUR_SERVER_IP/api/v1/languages
```

---

## 📊 Monitoring

```bash
# SSH into server
ssh user@YOUR_SERVER_IP

# View PM2 status
pm2 status
pm2 monit

# View logs
pm2 logs naarisamata-portal

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🆘 Troubleshooting

### Application won't start
```bash
pm2 logs naarisamata-portal --lines 50
pm2 restart all
```

### Can't connect to database
```bash
# Test from app server
psql "postgresql://naarisamata_user:PASSWORD@DB_IP:5432/naarisamata_staging"
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📚 Full Documentation

For detailed instructions, see:
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Complete step-by-step
- [Environment Variables](./ENV-VARS-REFERENCE.md) - All env vars explained
- [README](../README.md) - Project overview

---

## 💡 Tips

1. **Use SSH keys** instead of passwords for server access
2. **Set up monitoring** with Sentry or similar
3. **Configure backups** for PostgreSQL database
4. **Use a domain** instead of IP addresses for production
5. **Enable SSL/TLS** with Let's Encrypt for HTTPS
6. **Monitor logs** regularly for errors
7. **Keep servers updated** with security patches

---

**Need Help?**
- Check logs: `pm2 logs`
- Review full guide: `deployment/DEPLOYMENT-GUIDE.md`
- GitHub Issues: https://github.com/tangy83/NaSaSakhi/issues
