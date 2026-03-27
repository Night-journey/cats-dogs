module.exports = {
  apps: [
    {
      name: 'cats-dogs',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_BASE_URL: 'https://xaufe.top'
      }
    }
  ]
};
