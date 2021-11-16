# ccr.ccs.tencentyun.com/livzon/node-zero:test
# 构建层
FROM ccr.ccs.tencentyun.com/livzon/node:12.21.0-alpine as build
ARG APP_PATH=/app

ADD . ${APP_PATH}

RUN cd ${APP_PATH} \
    && npm install --dev \
    && npm run build \
    && rm -rf src node_modules \
    && npm install --production

# 最终层
FROM ccr.ccs.tencentyun.com/livzon/node:12.21.0-alpine
ARG APP_PATH=/app

COPY --from=build ${APP_PATH}/ ${APP_PATH}/

WORKDIR ${APP_PATH}
EXPOSE 3001

CMD [ "npm", "run", "start:online" ]
