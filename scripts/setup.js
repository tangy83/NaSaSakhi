#!/usr/bin/env node

/**
 * Cross-platform setup script
 * Checks prerequisites and initializes the project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf-8' }).trim();
    return version;
  } catch {
    return null;
  }
}

function getNpmVersion() {
  try {
    const version = execSync('npm --version', { encoding: 'utf-8' }).trim();
    return version;
  } catch {
    return null;
  }
}

function checkPrerequisites() {
  log('\n🔍 Checking Prerequisites...', colors.blue);
  log('============================\n', colors.blue);

  const checks = [];

  // Check OS
  const platform = os.platform();
  const platformName = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
  }[platform] || platform;

  log(`Operating System: ${platformName}`, colors.cyan);
  checks.push({ name: 'OS', status: true, message: platformName });

  // Check Node.js
  const nodeVersion = getNodeVersion();
  if (nodeVersion) {
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    if (majorVersion >= 18) {
      log(`✅ Node.js: ${nodeVersion}`, colors.green);
      checks.push({ name: 'Node.js', status: true, message: nodeVersion });
    } else {
      log(`⚠️  Node.js: ${nodeVersion} (Recommended: v18+)`, colors.yellow);
      checks.push({ name: 'Node.js', status: 'warning', message: `${nodeVersion} (upgrade recommended)` });
    }
  } else {
    log('❌ Node.js: Not found', colors.red);
    checks.push({ name: 'Node.js', status: false, message: 'Not installed' });
  }

  // Check npm
  const npmVersion = getNpmVersion();
  if (npmVersion) {
    log(`✅ npm: ${npmVersion}`, colors.green);
    checks.push({ name: 'npm', status: true, message: npmVersion });
  } else {
    log('❌ npm: Not found', colors.red);
    checks.push({ name: 'npm', status: false, message: 'Not installed' });
  }

  // Check Git
  if (checkCommand('git')) {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    log(`✅ Git: ${gitVersion}`, colors.green);
    checks.push({ name: 'Git', status: true, message: gitVersion });
  } else {
    log('⚠️  Git: Not found (optional)', colors.yellow);
    checks.push({ name: 'Git', status: 'warning', message: 'Not installed (optional)' });
  }

  // Check PostgreSQL (optional)
  if (checkCommand('psql')) {
    log('✅ PostgreSQL: Installed', colors.green);
    checks.push({ name: 'PostgreSQL', status: true, message: 'Installed' });
  } else {
    log('ℹ️  PostgreSQL: Not found (required for local database)', colors.cyan);
    checks.push({ name: 'PostgreSQL', status: 'info', message: 'Not installed (required for local DB)' });
  }

  return checks;
}

function createEnvFiles() {
  log('\n📝 Creating Environment Files...', colors.blue);

  const files = [
    { src: 'apps/backend/.env.example', dest: 'apps/backend/.env.backend' },
    { src: 'apps/frontend/.env.example', dest: 'apps/frontend/.env.local' },
  ];

  files.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, '..', src);
    const destPath = path.join(__dirname, '..', dest);

    if (!fs.existsSync(destPath) && fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      log(`✅ Created ${dest}`, colors.green);
    } else if (fs.existsSync(destPath)) {
      log(`ℹ️  ${dest} already exists`, colors.cyan);
    }
  });
}

function installDependencies() {
  log('\n📦 Installing Dependencies...', colors.blue);

  try {
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Dependencies installed successfully!', colors.green);
    return true;
  } catch (error) {
    log('❌ Failed to install dependencies', colors.red);
    return false;
  }
}

function printNextSteps() {
  log('\n📋 Next Steps:', colors.cyan);
  log('=============\n', colors.cyan);

  log('1. Configure environment variables:', colors.yellow);
  log('   - Edit apps/backend/.env.backend');
  log('   - Edit apps/frontend/.env.local');
  log('   - Generate secrets: node scripts/generate-secrets.js\n');

  log('2. Set up PostgreSQL database:', colors.yellow);
  log('   - Install PostgreSQL (if not already installed)');
  log('   - Create database: naarisamata_staging');
  log('   - Update DATABASE_URL in .env.backend\n');

  log('3. Generate Prisma client:', colors.yellow);
  log('   cd apps/backend && npm run prisma:generate\n');

  log('4. Run database migrations:', colors.yellow);
  log('   cd apps/backend && npm run prisma:migrate\n');

  log('5. Start development servers:', colors.yellow);
  log('   npm run dev\n');

  log('For deployment, see:', colors.cyan);
  log('   deployment/DEPLOYMENT-GUIDE.md\n');
}

async function main() {
  log('🚀 NaariSamata Project Setup', colors.green);
  log('===========================\n', colors.green);

  // Check prerequisites
  const checks = checkPrerequisites();

  // Check for critical failures
  const criticalFailures = checks.filter(c => c.status === false);
  if (criticalFailures.length > 0) {
    log('\n❌ Critical dependencies missing!', colors.red);
    log('Please install the following:', colors.yellow);
    criticalFailures.forEach(c => {
      log(`   - ${c.name}`, colors.yellow);
    });
    log('\nInstallation guides:', colors.cyan);
    log('   Node.js: https://nodejs.org/');
    log('   npm: Included with Node.js');
    process.exit(1);
  }

  // Create environment files
  createEnvFiles();

  // Ask if user wants to install dependencies
  log('\n');
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question('Install dependencies now? (y/n): ', (answer) => {
    readline.close();

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const success = installDependencies();
      if (success) {
        printNextSteps();
      }
    } else {
      log('\nSkipping dependency installation.', colors.yellow);
      log('Run "npm install" when ready.\n', colors.yellow);
      printNextSteps();
    }
  });
}

main();
