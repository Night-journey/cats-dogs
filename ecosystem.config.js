module.exports = {
  apps: [
    {
      name: 'campus-stray-animal-platform',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_BASE_URL: 'http://119.29.209.212'
      }
    }
  ]
};
