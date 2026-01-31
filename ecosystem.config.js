/**
 * PM2 Ecosystem Configuration for NaariSamata Portal
 *
 * Production-ready PM2 configuration for running Next.js in cluster mode
 */

module.exports = {
  apps: [{
    name: 'naarisamata-portal',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/naarisamata-portal',

    // Cluster mode for load balancing
    instances: 2,  // Adjust based on server CPU cores
    exec_mode: 'cluster',

    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },

    // Logging
    error_file: '/var/log/naarisamata/error.log',
    out_file: '/var/log/naarisamata/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,

    // Auto-restart configuration
    autorestart: true,
    watch: false,  // Set to true for development, false for production
    max_memory_restart: '1G',

    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,

    // Source map support
    source_map_support: true,

    // Instance error handling
    min_uptime: '10s',
    max_restarts: 10,

    // Cron restart (optional - restart daily at 3 AM)
    // cron_restart: '0 3 * * *',

    // Post-deploy hooks (optional)
    // post_update: ['npm install', 'npx prisma generate', 'npm run build']
  }]
};
