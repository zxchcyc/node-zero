/*
 * @Author: archer zheng
 * @Date: 2021-11-08 17:22:21
 * @LastEditTime: 2022-03-23 13:06:39
 * @LastEditors: archer zheng
 * @Description: RocketMQ 发送抽象类
 */
export abstract class AbstractRocketmqService {
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
  abstract publishMessage(
    tag: string,
    data: Record<string, any>,
    messageKey?: string,
    messageName?: string,
    topic?: string,
  ): Promise<void>;
}
