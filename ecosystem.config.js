module.exports = {
  apps: [
    {
      name: 'node-zero',
      exec_mode: 'cluster',
      script: 'dist/main.js',
      instances: 2,
      error_file: './logs/master/err.log',
      out_file: './logs/master/out.log',
      log_file: './logs/master/combined.log',
      env: {
        NODE_ENV: 'local',
        PORT: 3001,
        TASK_ENABLED: true,
        SERVICE_NAME: 'node-zero',
        CONFIG_FOLDER: '../config',
      },
      env_dev: {
        NODE_ENV: 'dev',
        PORT: 3001,
        TASK_ENABLED: true,
        SERVICE_NAME: 'node-zero',
        CONFIG_FOLDER: '../config',
      },
    },
  ],
};
