/*
 * @Author: archer zheng
 * @Date: 2021-11-08 17:22:21
 * @LastEditTime: 2021-12-17 17:49:03
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
}

export interface IBullMsgBody {
  [key: string]: any;
}

export interface IBullUri {
  queue: string;
  topic: string;
  tag?: string;
}

export abstract class AbstractMqService {
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
}
