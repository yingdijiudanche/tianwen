module.exports = {
  apps: [
    {
      name: 'GreenFacility',
      namespace: 'GreenFacility',
      script: './server.js',
      watch: false,
      instance_var: 'INSTANCE_ID',
	  exp_backoff_restart_delay: 1000,
	  max_memory_restart: '2G',
	  max_restarts: 5,
	  time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        PORT: 31015,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 31015,
        NODE_ENV: 'production',
      },
    },
  ],
};
