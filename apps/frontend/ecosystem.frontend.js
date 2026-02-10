module.exports = {
  apps: [{
    name: 'naarisamata-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/naarisamata-portal/apps/frontend',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: '/var/log/naarisamata/frontend-error.log',
    out_file: '/var/log/naarisamata/frontend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
  }]
};
