/*
 * @Author: archer zheng
 * @Date: 2021-11-08 17:22:21
 * @LastEditTime: 2022-04-05 21:39:23
 * @LastEditors: archer zheng
 * @Description: MQ 发送抽象类
 */
// 根据业务确定即可
export interface JobOptions {
  priority?: number | undefined;
  delay?: number | undefined;
  attempts?: number | undefined;
  lifo?: boolean | undefined;
  timeout?: number | undefined;
  jobId?: number | string | undefined;
}

export interface IBullMsgBody {
  [key: string]: any;
}

export interface IBullUri {
  queue: string;
  topic: string;
  tag?: string;
}

export abstract class AbstractBullMqService {
  /**
   * 发送消息
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  abstract add(
    uri: IBullUri,
    data: IBullMsgBody,
    opts?: JobOptions,
  ): Promise<void>;

  /**
   * 批量发送消息
   *
   * @param {IBullUri} uri 定位信息
   * @param {IBullMsgBody[]} data 发送的数据
   * @param {JobOptions} opts 配置
   */
  abstract addBulk(
    uri: IBullUri,
    data: IBullMsgBody[],
    opts?: JobOptions,
  ): Promise<void>;

  /**
   * 获取任务详情
   *
   * @param {string} queue 队列
   * @param {string|number} jobId 任务ID
   */
  abstract getJob(queue: string, jobId: string | number): Promise<any>;
}
