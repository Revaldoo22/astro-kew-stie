module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.js',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
        NODE_ENV: 'production',
        PORT: 30069,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};

