#!/usr/bin/env node

/**
 * Cross-platform deployment script
 * Works on Windows, Mac, and Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      ...options,
    });
  } catch (error) {
    log(`❌ Command failed: ${command}`, colors.red);
    throw error;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

async function deployBackend() {
  log('\n📦 Deploying Backend...', colors.blue);

  const backendDir = path.join(__dirname, '..', 'apps', 'backend');
  process.chdir(backendDir);

  // Check if .env.backend exists
  if (!checkFileExists('.env.backend')) {
    log('⚠️  Warning: .env.backend not found. Using .env.example as template.', colors.yellow);
    if (checkFileExists('.env.example')) {
      fs.copyFileSync('.env.example', '.env.backend');
      log('📝 Created .env.backend from template. Please fill in the values!', colors.yellow);
    }
  }

  // Install dependencies
  log('Installing backend dependencies...', colors.blue);
  exec('npm install');

  // Generate Prisma client
  log('Generating Prisma client...', colors.blue);
  exec('npm run prisma:generate');

  // Build backend
  log('Building backend...', colors.blue);
  exec('npm run build');

  log('✅ Backend deployment complete!', colors.green);
}

async function deployFrontend() {
  log('\n📦 Deploying Frontend...', colors.blue);

  const frontendDir = path.join(__dirname, '..', 'apps', 'frontend');
  process.chdir(frontendDir);

  // Check if .env.frontend exists
  if (!checkFileExists('.env.frontend') && !checkFileExists('.env.local')) {
    log('⚠️  Warning: .env.frontend not found. Using .env.example as template.', colors.yellow);
    if (checkFileExists('.env.example')) {
      fs.copyFileSync('.env.example', '.env.local');
      log('📝 Created .env.local from template. Please fill in the values!', colors.yellow);
    }
  }

  // Install dependencies
  log('Installing frontend dependencies...', colors.blue);
  exec('npm install');

  // Build frontend
  log('Building frontend...', colors.blue);
  exec('npm run build');

  log('✅ Frontend deployment complete!', colors.green);
}

async function main() {
  log('🚀 Starting Cross-Platform Deployment', colors.bright + colors.green);
  log('====================================\n', colors.green);

  const args = process.argv.slice(2);
  const target = args[0] || 'all';

  try {
    if (target === 'backend' || target === 'all') {
      await deployBackend();
    }

    if (target === 'frontend' || target === 'all') {
      await deployFrontend();
    }

    log('\n🎉 Deployment completed successfully!', colors.bright + colors.green);
    log('\nNext steps:', colors.blue);
    log('1. Configure environment variables (.env files)');
    log('2. Run database migrations: npm run prisma:migrate');
    log('3. Start services: npm run dev (development) or npm start (production)');
  } catch (error) {
    log('\n❌ Deployment failed!', colors.red);
    process.exit(1);
  }
}

main();
