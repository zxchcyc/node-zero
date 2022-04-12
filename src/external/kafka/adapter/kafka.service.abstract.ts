import { KafkaMessageObject } from '@rob3000/nestjs-kafka';
import { RecordMetadata } from 'kafkajs';
/*
 * @Author: archer zheng
 * @Date: 2021-11-08 17:22:21
 * @LastEditTime: 2022-04-12 11:11:48
 * @LastEditors: archer zheng
 * @Description: Kafka 发送抽象类
 */
export abstract class AbstractKafkaService {
  abstract send(
    topic: string,
    messages: KafkaMessageObject[],
  ): Promise<RecordMetadata[]>;
}
