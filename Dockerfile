FROM ccr.ccs.tencentyun.com/livzon/node:14.17.3-alpine

ARG APP_PATH=/app

ADD . ${APP_PATH}

WORKDIR ${APP_PATH}

EXPOSE 3001

CMD [ "npm", "run", "start:online" ]
