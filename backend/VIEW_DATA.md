# How to View Seeded Data

## Method 1: Prisma Studio (Recommended - Visual Browser)

Prisma Studio is a visual database browser that lets you view and edit data through a web interface.

### Steps:

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Start Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```
   Or:
   ```bash
   npx prisma studio
   ```

3. **Open in browser:**
   - Prisma Studio will automatically open at: **http://localhost:5555**
   - If it doesn't open automatically, manually navigate to that URL

4. **View your data:**
   - You'll see all tables on the left sidebar
   - Click on any table (e.g., `Language`, `State`, `City`, `ServiceCategory`) to view its data
   - You can filter, search, and edit records directly

### What you'll see:
- ✅ **Language** - 30 languages
- ✅ **State** - 36 states/UTs
- ✅ **City** - 106 cities
- ✅ **ServiceCategory** - 14 categories
- ✅ **ServiceResource** - 168 resources
- ✅ **Faith** - 8 faith options
- ✅ **SocialCategory** - 5 social categories

---

## Method 2: Using Verification Scripts

Run the verification scripts to see counts and data:

```bash
# View all seed data counts
npx tsx scripts/verify-seed-counts.ts

# View detailed seed data
npx tsx scripts/verify-seed.ts

# View all languages
npx tsx scripts/check-languages.ts
```

---

## Method 3: Direct Database Query (Advanced)

If you have PostgreSQL client tools installed:

```bash
# Connect to database (using connection string from .env)
psql "postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg-nmjuxe7e5m.tcp-proxy-2212.dcdeploy.cloud:30095/nasasakhidbstg-db"

# Then run queries:
SELECT COUNT(*) FROM "Language";        -- Should be 30
SELECT COUNT(*) FROM "State";           -- Should be 36
SELECT COUNT(*) FROM "City";            -- Should be 106
SELECT COUNT(*) FROM "ServiceCategory"; -- Should be 14
SELECT * FROM "Language" LIMIT 10;      -- View first 10 languages
```

---

## Method 4: API Endpoints (Once Created)

After Stage 6 is complete, you'll be able to view data via API:

```bash
# Get all languages
curl http://localhost:3000/api/reference/languages

# Get all states
curl http://localhost:3000/api/reference/states

# Get all cities
curl http://localhost:3000/api/reference/cities
```

---

## Quick Start (Easiest Method)

**Just run this command:**
```bash
cd backend
npm run prisma:studio
```

Then open **http://localhost:5555** in your browser! 🎉
