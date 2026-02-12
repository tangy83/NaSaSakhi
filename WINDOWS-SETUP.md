# Windows Setup Guide

This guide helps Windows developers set up the NaariSamata project without Docker Desktop.

## Prerequisites

### 1. Install Node.js

Download and install Node.js 18+ from: https://nodejs.org/

```powershell
# Verify installation
node --version
npm --version
```

### 2. Install Git (Optional)

Download from: https://git-scm.com/download/win

**Important:** During installation, select:
- ✅ "Checkout as-is, commit Unix-style line endings" (recommended)
- OR "Checkout as-is, commit as-is" (if you know what you're doing)

### 3. Install PostgreSQL (for local database)

Download from: https://www.postgresql.org/download/windows/

Or use WSL2 (recommended for better compatibility):

```powershell
# In PowerShell (Admin)
wsl --install
```

Then install PostgreSQL in WSL:

```bash
# In WSL
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

## Project Setup

### 1. Clone Repository

```powershell
git clone https://github.com/tangy83/NaSaSakhi.git
cd NaSaSakhi
```

### 2. Run Setup Script

```powershell
npm run setup
```

This will:
- Check prerequisites
- Create environment files
- Install dependencies

### 3. Generate Secrets

```powershell
npm run generate-secrets
```

Copy the generated secrets to your `.env` files.

### 4. Configure Environment Variables

**Backend (`apps/backend/.env.backend`):**

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/naarisamata_dev
NEXTAUTH_SECRET=<paste-generated-secret>
NEXTAUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**Frontend (`apps/frontend/.env.local`):**

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-same-secret-as-backend>
```

### 5. Set Up Database

**If using local PostgreSQL:**

```powershell
# Using psql
psql -U postgres

# In psql:
CREATE DATABASE naarisamata_dev;
\q
```

**If using WSL PostgreSQL:**

```bash
# In WSL
sudo -u postgres psql

# In psql:
CREATE DATABASE naarisamata_dev;
\q
```

### 6. Generate Prisma Client

```powershell
cd apps/backend
npm run prisma:generate
```

### 7. Run Database Migrations

```powershell
npm run prisma:migrate
```

### 8. Start Development Servers

```powershell
# Go back to root directory
cd ../..

# Start both frontend and backend
npm run dev
```

**Alternatively, start separately in different terminals:**

Terminal 1 (Backend):
```powershell
npm run dev:backend
```

Terminal 2 (Frontend):
```powershell
npm run dev:frontend
```

## Common Windows Issues

### Issue: Line Ending Errors

**Symptom:** Shell scripts or files have `^M` characters or won't execute.

**Solution:** The `.gitattributes` file automatically handles this. If you still have issues:

```powershell
git config --global core.autocrlf input
git rm --cached -r .
git reset --hard
```

### Issue: Permission Denied on Scripts

**Symptom:** `EACCES: permission denied` when running scripts.

**Solution:** Windows doesn't use Unix permissions. The error usually means:

1. **File in use:** Close any programs using the file
2. **Antivirus blocking:** Temporarily disable or add exception
3. **Run as Administrator:** Right-click PowerShell → "Run as Administrator"

### Issue: `concurrently` Not Working

**Symptom:** `npm run dev` fails to start both servers.

**Solution:** Use separate terminals instead:

```powershell
# Terminal 1
npm run dev:backend

# Terminal 2 (new window)
npm run dev:frontend
```

### Issue: PostgreSQL Connection Failed

**Symptom:** "ECONNREFUSED" or "database does not exist"

**Solution:**

1. **Check PostgreSQL is running:**

   ```powershell
   # Check Windows Services
   services.msc
   # Look for "postgresql-x64-15" or similar
   ```

   Or in WSL:
   ```bash
   sudo service postgresql status
   ```

2. **Check connection string in `.env.backend`:**

   - Host should be `localhost` for local PostgreSQL
   - For WSL PostgreSQL, use `127.0.0.1` or WSL IP address

3. **Test connection:**

   ```powershell
   psql -h localhost -U postgres -d naarisamata_dev
   ```

### Issue: Port Already in Use

**Symptom:** "EADDRINUSE: address already in use :::3000"

**Solution:**

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env files
```

## Alternative: Use WSL2 (Recommended)

For the best development experience on Windows, use WSL2:

### Install WSL2

```powershell
# In PowerShell (Admin)
wsl --install
wsl --set-default-version 2
```

### Install Ubuntu from Microsoft Store

Then follow the main Linux/Mac setup instructions inside WSL.

### Access Files in WSL

Windows: `\\wsl$\Ubuntu\home\<username>\NaSaSakhi`

WSL: `/mnt/c/Users/<username>/...` (to access Windows files)

## Without Docker Desktop

This project is designed to work without Docker Desktop. Use these alternatives:

### For Development

- **Local installation:** Node.js + PostgreSQL (this guide)
- **WSL2:** Full Linux environment on Windows (recommended)

### For Production/Staging

Use one of these deployment methods:

1. **Direct server deployment:** Deploy to VPS using PM2
2. **Docker on Linux server:** Use Docker on your staging/production servers
3. **Platform as a Service:** Vercel, Railway, Render, etc.

See [deployment/DEPLOYMENT-GUIDE.md](deployment/DEPLOYMENT-GUIDE.md) for details.

## VS Code Setup (Recommended)

Install these extensions for better development experience:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Prisma** - Database schema support
- **WSL** - If using WSL2
- **GitLens** - Git integration

## Getting Help

If you encounter issues:

1. Check the main [README.md](README.md)
2. Review [deployment/DEPLOYMENT-GUIDE.md](deployment/DEPLOYMENT-GUIDE.md)
3. Create an issue on GitHub with:
   - Your Windows version
   - Node.js version (`node --version`)
   - Error message/logs
   - Steps to reproduce

## Quick Commands Reference

```powershell
# Setup project
npm run setup

# Generate secrets
npm run generate-secrets

# Install dependencies
npm install

# Generate Prisma client
cd apps/backend
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development
npm run dev

# Build for production
npm run build

# Deploy (cross-platform)
npm run deploy
```

## Tips for Windows Contributors

1. **Use PowerShell or Windows Terminal** (not CMD)
2. **Enable long paths** if you get path length errors:
   ```powershell
   # Run as Administrator
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```
3. **Use VS Code's integrated terminal** for consistent experience
4. **Consider WSL2** for the closest experience to Linux/Mac
5. **Never commit `.env` files** - they're in `.gitignore`

## Success!

Once everything is running, you should see:

- Backend: http://localhost:4000/health
- Frontend: http://localhost:3000

You're ready to contribute! 🎉
