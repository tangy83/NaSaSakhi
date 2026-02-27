# Multi-stage Dockerfile for NaariSamata Portal
# Standalone mode — optimised for DC Deploy

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# prisma.config.ts points to backend/prisma/schema.prisma (full 25-model schema)
# Both must be present before `prisma generate` runs
COPY prisma.config.ts ./
COPY backend/prisma ./backend/prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client using the full backend schema
RUN npx prisma generate

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Dummy DATABASE_URL so Next.js can collect page data at build time without a
# real DB connection. Prisma initialises the module but doesn't connect until a
# query is actually executed — the real URL is injected at runtime by DC Deploy.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# Build application (standalone output configured in next.config.ts)
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets
COPY --from=builder /app/public ./public

# Standalone output bundles everything needed to run — no node_modules copy required
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma runtime (.so files for the query engine)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Standalone entrypoint produced by Next.js build
CMD ["node", "server.js"]
