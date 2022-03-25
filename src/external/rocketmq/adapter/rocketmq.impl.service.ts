/*
 * @Author: archer zheng
 * @Date: 2021-09-17 21:21:40
 * @LastEditTime: 2022-03-23 16:15:54
 * @LastEditors: archer zheng
 * @Description: RocketMQ走这里出去
 */
import { Logger, Injectable } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import { MessageProperties } from '@aliyunmq/mq-http-sdk';
import { RocketmqClientService } from '../client/client.service';
import { AbstractRocketmqService } from './rocketmq.service.abstract';
import { v4 as uuidv4 } from 'uuid';
import { timer, from } from 'rxjs';
import { retryWhen, delayWhen, tap, scan } from 'rxjs/operators';

@Injectable()
export class RocketmqService implements AbstractRocketmqService {
  private MQ_MAX_RETRY = 10;
  private MQ_ATTEMPT_DELAY_FACTOR = 3000;
  private readonly client = this.rocketmqClientService.client;
  private logger: Logger = new Logger(RocketmqService.name);

  constructor(
    private readonly envService: EnvService,
    private readonly rocketmqClientService: RocketmqClientService,
  ) {}

  /**
   * @description:发送mq消息
   * @param {string} tag 二级主题
   * @param {Record<string, any>} data 发送的数据
   * @param {string} messageKey 消息的key值
   * @param {string} messageName 消息的名字
   * @param {string} topic 消息的主题
   * @return {*}
   * @author: archer zheng
   */
  async publishMessage(
    tag: string,
    data: Record<string, any>,
    messageKey?: string,
    messageName?: string,
    topic?: string,
  ): Promise<void> {
    const producer = this.client.getProducer(
      this.envService.get('MQ_INSTANCE_ID'),
      topic || this.envService.get('MQ_DA_TOPIC'),
    );
    const msgProps = new MessageProperties();
    // 设置KEY MessageId不保证全局唯一，业务上应设置MessageKey来保证唯一性
    msgProps.messageKey(messageKey);
    const sendData = {
      header: {
        requestId: messageKey,
        messageId: uuidv4(),
        messageName,
        sourceSystemCode: process.env.SERVICE_NAME,
      },
      body: data,
    };
    // 转义特殊字符
    const sendStr: string = JSON.stringify(sendData)
      .replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;');
    const sendRes = from(producer.publishMessage(sendStr, tag, msgProps));
    sendRes
      .pipe(
        retryWhen((errors) => {
          return errors.pipe(
            scan((errCount, error) => {
              if (errCount >= this.MQ_MAX_RETRY) {
                throw new Error(error);
              }
              return errCount + 1;
            }, 0),
            delayWhen((errCount) =>
              timer(this.MQ_ATTEMPT_DELAY_FACTOR * errCount),
            ),
            tap((errCount) => {
              this.logger.warn(
                `发送mq失败,将进行第${errCount}次重试！ tag:${tag} key:${messageKey} data:${JSON.stringify(
                  sendData,
                )} `,
              );
            }),
          );
        }),
      )
      .subscribe(
        (res) => {
          this.logger.debug('res:', res);
        },
        (error) => {
          this.logger.error('error:', error);
        },
        () => {
          this.logger.verbose(
            `发送mq成功: tag:${tag} key:${messageKey} data:${JSON.stringify(
              sendData,
            )} `,
          );
        },
      );
  }
}
