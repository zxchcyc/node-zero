/*
 * @Author: archer zheng
 * @Date: 2021-09-17 21:21:40
 * @LastEditTime: 2022-03-30 14:34:55
 * @LastEditors: archer zheng
 * @Description: BULL MQ走这里出去
 */
import { Logger, Injectable } from '@nestjs/common';
import { BULL_QUEUES } from '../constant/constant';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';
import {
  AbstractBullMqService,
  IBullMsgBody,
  IBullUri,
} from './bullmq.service.abstract';
import { runOnTransactionCommit } from 'typeorm-transactional-cls-hooked';
import { getContext } from 'src/awesome';

@Injectable()
export class BullmqService implements AbstractBullMqService {
  private logger: Logger = new Logger(BullmqService.name);
  private queueMap = new Map<string, Queue>();

  constructor(
    @InjectQueue('common') private common: Queue,
    @InjectQueue('cms') private cms: Queue,
    @InjectQueue('user') private user: Queue,
    @InjectQueue('msg') private msg: Queue,
  ) {
    BULL_QUEUES.forEach((e) => this.queueMap.set(e, this[e]));
  }

  /**
   * 发送 bull 消息 事务成功之后在发送
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  async add(uri: IBullUri, data: IBullMsgBody, opts?: JobOptions) {
    try {
      runOnTransactionCommit(async () => {
        await this.addReal(uri, data, opts);
      });
    } catch (error) {
      await this.addReal(uri, data, opts);
    }
  }

  /**
   * 批量发送 bull 消息 事务成功之后发送
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody[]} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  async addBulk(uri: IBullUri, data: IBullMsgBody[], opts?: JobOptions) {
    try {
      runOnTransactionCommit(async () => {
        await this.addBulkReal(uri, data, opts);
      });
    } catch (error) {
      await this.addBulkReal(uri, data, opts);
    }
  }

  /**
   * 发送 bull 消息
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  async addReal(uri: IBullUri, data: IBullMsgBody, opts?: JobOptions) {
    try {
      // this.logger.debug('bull add', uri);
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
            user: getContext('user'),
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
  async addBulkReal(uri: IBullUri, data: IBullMsgBody[], opts?: JobOptions) {
    try {
      // this.logger.debug('bull addBulk', uri);
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
              user: getContext('user'),
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
