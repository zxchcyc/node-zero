FROM node

ARG APP_PATH=/app

ADD . ${APP_PATH}

WORKDIR ${APP_PATH}

EXPOSE 3002

ENV TASK_ENABLED=false NODE_ENV=local SERVICE_NAME=node-zero-api CONFIG_FOLDER=../config PORT=3002

CMD [ "npm", "run", "start:online" ]
