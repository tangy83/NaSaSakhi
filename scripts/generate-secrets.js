#!/usr/bin/env node

/**
 * Cross-platform secret generator
 * Generates secure random strings for environment variables
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

function generatePassword(length = 24) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

console.log('🔐 Generated Secrets for Environment Variables\n');
console.log('Copy these values to your .env files:\n');
console.log('─────────────────────────────────────────────────\n');

console.log('Database Password (DB_PASSWORD):');
console.log(generatePassword(24));
console.log('');

console.log('NextAuth Secret (NEXTAUTH_SECRET):');
console.log(generateSecret(32));
console.log('');

console.log('─────────────────────────────────────────────────\n');
console.log('⚠️  Important:');
console.log('1. Keep these secrets safe and never commit them to Git');
console.log('2. Use the SAME NEXTAUTH_SECRET in both frontend and backend');
console.log('3. Store these in:');
console.log('   - apps/backend/.env.backend');
console.log('   - apps/frontend/.env.local');
console.log('   - deployment/docker/.env.split (for Docker deployment)');
