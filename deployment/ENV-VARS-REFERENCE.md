# Environment Variables Reference

## Quick Setup Guide

Copy `.env.example` to `.env` and fill in the values below:

---

## 🗄️ Database Configuration

### PostgreSQL (SaathiDB)

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

**Example for Staging:**
```bash
DATABASE_URL="postgresql://naarisamata_user:your-secure-password@SaathiDB_IP:5432/naarisamata_staging"
```

**Local Development:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/naarisamata_dev"
```

### MySQL (Existing - Temporary for Migration)

```bash
MYSQL_HOST="your-mysql-host"
MYSQL_PORT="3306"
MYSQL_DATABASE="sakhi"
MYSQL_USER="your-username"
MYSQL_PASSWORD="your-password"
```

---

## 🔐 Authentication (NextAuth.js)

### NEXTAUTH_URL
The canonical URL of your site.

**Staging:**
```bash
NEXTAUTH_URL="http://SaathiFEStg_IP:3000"
# or with domain:
NEXTAUTH_URL="https://staging.naarisamata.org"
```

**Local Development:**
```bash
NEXTAUTH_URL="http://localhost:3000"
```

### NEXTAUTH_SECRET
Random secret for encrypting tokens (min 32 characters).

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```bash
NEXTAUTH_SECRET="your-random-32-character-minimum-secret-here"
```

---

## 🌍 Application Configuration

### NODE_ENV
```bash
NODE_ENV="development"  # or "staging" or "production"
```

### PORT (optional)
```bash
PORT=3000  # Default: 3000
```

### NEXT_PUBLIC_APP_URL
Public-facing URL (accessible from browser).

```bash
NEXT_PUBLIC_APP_URL="http://staging.naarisamata.org"
```

---

## 🌐 Translation API

### Google Cloud Translation

```bash
GOOGLE_TRANSLATE_API_KEY="your-google-cloud-api-key"
```

**How to get:**
1. Go to Google Cloud Console
2. Enable Cloud Translation API
3. Create API key
4. Copy key here

**Cost:** ~$20/1M characters (can be optimized with caching)

---

## 📤 File Upload (AWS S3 or Cloudflare R2)

### AWS S3

```bash
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="naarisamata-uploads-staging"
```

### OR Cloudflare R2 (S3-compatible)

```bash
AWS_ACCESS_KEY_ID="your-r2-access-key"
AWS_SECRET_ACCESS_KEY="your-r2-secret-key"
AWS_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
AWS_S3_BUCKET="naarisamata-uploads"
```

---

## 📧 Email Service

### Option 1: SendGrid

```bash
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@naarisamata.org"
```

### Option 2: Resend

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="noreply@naarisamata.org"
```

---

## 📊 Monitoring & Analytics (Optional)

### Sentry (Error Tracking)

```bash
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
SENTRY_AUTH_TOKEN="your-auth-token"
```

### Vercel Analytics

```bash
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
```

---

## 🔧 Development Only

```bash
# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# Enable debug logs
DEBUG=*
```

---

## 📝 Complete .env Template

```bash
# ============================================
# Database Configuration
# ============================================
DATABASE_URL="postgresql://naarisamata_user:PASSWORD@SaathiDB_IP:5432/naarisamata_staging"

# Existing MySQL (for data migration)
MYSQL_HOST="your-mysql-host"
MYSQL_PORT="3306"
MYSQL_DATABASE="sakhi"
MYSQL_USER="your-username"
MYSQL_PASSWORD="your-password"

# ============================================
# Application
# ============================================
NODE_ENV="staging"
PORT=3000
NEXT_PUBLIC_APP_URL="http://your-staging-url"

# ============================================
# Authentication (NextAuth.js)
# ============================================
NEXTAUTH_URL="http://your-staging-url"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# ============================================
# Translation
# ============================================
GOOGLE_TRANSLATE_API_KEY="your-google-api-key"

# ============================================
# File Upload (Choose one)
# ============================================
# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# OR Cloudflare R2
# AWS_ACCESS_KEY_ID="your-r2-access-key"
# AWS_SECRET_ACCESS_KEY="your-r2-secret-key"
# AWS_ENDPOINT="https://account-id.r2.cloudflarestorage.com"
# AWS_S3_BUCKET="your-bucket-name"

# ============================================
# Email Service (Choose one)
# ============================================
# SendGrid
SENDGRID_API_KEY="SG.your-api-key"
EMAIL_FROM="noreply@naarisamata.org"

# OR Resend
# RESEND_API_KEY="re_your-api-key"
# EMAIL_FROM="noreply@naarisamata.org"

# ============================================
# Monitoring (Optional)
# ============================================
# Sentry
# NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# ============================================
# Development
# ============================================
NEXT_TELEMETRY_DISABLED=1
```

---

## 🔒 Security Best Practices

1. **Never commit .env files to Git** (already in .gitignore)
2. **Use strong passwords** (min 16 characters, random)
3. **Rotate secrets regularly** (every 90 days)
4. **Use different secrets per environment** (dev, staging, production)
5. **Limit API key permissions** (principle of least privilege)
6. **Store production secrets in a secret manager** (AWS Secrets Manager, HashiCorp Vault)

---

## 📞 Support

For questions about specific environment variables, see:
- Next.js docs: https://nextjs.org/docs/basic-features/environment-variables
- NextAuth.js docs: https://next-auth.js.org/configuration/options
- Prisma docs: https://www.prisma.io/docs/reference/database-reference/connection-urls
