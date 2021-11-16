/*
 * @Author: archer zheng
 * @Date: 2021-09-17 21:21:40
 * @LastEditTime: 2021-11-15 13:37:53
 * @LastEditors: archer zheng
 * @Description: BULL MQ走这里出去
 * @FilePath: /node-zero/src/external/mq/adapter/mq-bull.impl.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';
import { BULL_QUEUES } from '../constant/constant';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';
import {
  AbstractMqService,
  IBullMsgBody,
  IBullUri,
} from './mq.service.abstract';
import { getContext } from 'src/common';

@Injectable()
export class MqBullService implements AbstractMqService {
  private logger: Logger = new Logger(MqBullService.name);
  private queueMap = new Map<string, Queue>();

  constructor(
    @InjectQueue('cleanStudyTask') private cleanStudyTask: Queue,
    @InjectQueue('cleanCrfTask') private cleanCrfTask: Queue,
    @InjectQueue('cleanSubjectTask') private cleanSubjectTask: Queue,
    @InjectQueue('cleanRuleTask') private cleanRuleTask: Queue,
    @InjectQueue('cleanRuleConfigTask') private cleanRuleConfigTask: Queue,
    @InjectQueue('aggSubjectProgressTask')
    private aggSubjectProgressTask: Queue,
  ) {
    BULL_QUEUES.forEach((e) => this.queueMap.set(e, this[e]));
  }

  /**
   * 发送 bull 消息
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  async add(uri: IBullUri, data: IBullMsgBody, opts?: JobOptions) {
    try {
      this.logger.log('bull add', uri);
      const { queue, topic, tag } = uri;
      await this.queueMap.get(queue).add(
        topic,
        {
          tag,
          data: Object.assign({}, data),
          $context: {
            time: new Date(),
            ua: getContext('ua'),
            ip: getContext('ip'),
            uri: getContext('uri'),
            traceId: getContext('traceId'),
          },
        },
        opts,
      );
      return;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * 批量发送 bull 消息
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody[]} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  async addBulk(uri: IBullUri, data: IBullMsgBody[], opts?: JobOptions) {
    try {
      this.logger.log('bull addBulk', uri);
      const { queue, topic, tag } = uri;
      const tasks = data.map((e) => {
        return {
          name: topic,
          data: {
            tag,
            data: Object.assign({}, e),
            $context: {
              time: new Date(),
              ua: getContext('ua'),
              ip: getContext('ip'),
              uri: getContext('uri'),
              traceId: getContext('traceId'),
            },
          },
          opts,
        };
      });
      await this.queueMap.get(queue).addBulk(tasks);
      return;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
