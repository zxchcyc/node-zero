import { EnvService } from 'src/internal/env/env.service';
import { Injectable, Logger } from '@nestjs/common';
import { RocketmqClientService } from '../client/client.service';
import { Consumer, MqMessage } from './consumer';

/**
 * RocketMQ 服务类
 */

@Injectable()
export class ListenService {
  private readonly client = this.rocketmqClientService.client;
  private readonly logger: Logger = new Logger(ListenService.name);
  constructor(
    private readonly envService: EnvService,
    private readonly rocketmqClientService: RocketmqClientService,
  ) {}

  genListenFunc(
    topic: string,
    tag: string,
    routerClass: any,
    routerInstance: any,
  ) {
    this.logger.debug('===genListenFunc===', topic, tag);
    return async () => {
      this.logger.debug('mq start listening...');
      this.listenMq(topic, tag, async (message: MqMessage) => {
        const tag = message.MessageTag;
        this.logger.debug(message);
        // 分发处理
        const routes = Reflect.getMetadata('MQTag', routerClass);
        if (typeof routes?.[tag] === 'function') {
          await routes[tag].bind(routerInstance)(message);
        } else {
          this.logger.warn('非法消费');
        }
        return;
      });
    };
  }

  /**
   * @description: 监听rocketmq消息
   * @param {string} topic 一级主题
   * @param {string} tag 二级主题
   * @param {Function} handler 消息路由函数
   * @author: archer zheng
   */
  private async listenMq(
    topic: string,
    tag: string,
    handler: (message: MqMessage) => Promise<void>,
  ) {
    const consumerClient = this.client.getConsumer(
      this.envService.get('MQ_INSTANCE_ID'),
      topic,
      this.envService.get('MQ_GROUP_ID'),
      tag,
    );
    const option = {
      consumerClient,
      // 轮询间隔1s
      pollingWaitTimeMs: 1000,
      handleMessage: async (message: MqMessage) => {
        this.logger.debug(`data: ${JSON.stringify(message)}`);
        await handler(message);
      },
    };
    const consumer = Consumer.create(option);

    consumer.on('error', (error, message: MqMessage) => {
      let errorMsg = `消费mq消息失败 topic: ${topic} ${error.message} ${error.stack}`;
      if (message) {
        errorMsg = `mq消费失败 topic:${topic}, tag:${message.MessageTag}, key:${
          message.MessageKey
        }, error:${error.message}, stack:${
          error.stack
        }, message:${JSON.stringify(message)}`;
      }
      if (error.name === 'LockError') {
        this.logger.warn(errorMsg);
      } else {
        this.logger.error(errorMsg);
      }
    });

    consumer.on('messageReceived', (message: MqMessage) => {
      this.logger.debug(
        `接收mq到消息 topic: ${topic} tag:${message.MessageTag} key:${message.MessageKey} messageId:${message.MessageId}`,
      );
    });

    consumer.on('messageProcessed', (message: MqMessage) => {
      this.logger.debug(
        `消费mq消息成功 topic: ${topic} tag:${message.MessageTag} key:${message.MessageKey} messageId:${message.MessageId}`,
      );
    });

    // 数据异常报警，但不进行重试直接消费掉
    consumer.on('warn', (error, message: MqMessage) => {
      const property = `topic: ${topic} tag:${message.MessageTag} key:${message.MessageKey}`;
      const errorMsg = `error:${error.message}, stack:${error.stack}`;
      this.logger.warn(errorMsg, property);
    });

    consumer.start();
  }
}
