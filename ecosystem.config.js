module.exports = {
  apps: [
    {
      name: 'da-api',
      exec_mode: 'cluster',
      script: 'dist/main.js',
      instances: 2,
      error_file: './logs/master/err.log',
      out_file: './logs/master/out.log',
      log_file: './logs/master/combined.log',
      env: {
        NODE_ENV: 'local',
        PORT: 3002,
        TASK_ENABLED: true,
        SERVICE_NAME: 'da-api',
        CONFIG_FOLDER: '../config',
      },
      env_dev: {
        NODE_ENV: 'dev',
        PORT: 3002,
        TASK_ENABLED: true,
        SERVICE_NAME: 'da-api',
        CONFIG_FOLDER: '../config',
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 3002,
        TASK_ENABLED: true,
        SERVICE_NAME: 'da-api',
        CONFIG_FOLDER: '../config',
      },
      env_prod: {
        NODE_ENV: 'prod',
        PORT: 3002,
        TASK_ENABLED: true,
        SERVICE_NAME: 'da-api',
        CONFIG_FOLDER: '../config',
      },
    },
  ],
};
