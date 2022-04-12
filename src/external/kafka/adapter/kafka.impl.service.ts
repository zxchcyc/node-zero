/*
 * @Author: archer zheng
 * @Date: 2021-09-17 21:21:40
 * @LastEditTime: 2022-04-12 11:19:31
 * @LastEditors: archer zheng
 * @Description: Kafka走这里出去
 */
import { Injectable, Inject } from '@nestjs/common';
import { KafkaMessageObject } from '@rob3000/nestjs-kafka';
import { RecordMetadata } from 'kafkajs';
import { AbstractKafkaService } from './kafka.service.abstract';
import { KafkaService } from '@rob3000/nestjs-kafka';

@Injectable()
export class MyKafkaService implements AbstractKafkaService {
  constructor(@Inject('KAFKA_SERVICE') private client: KafkaService) {}

  async send(
    topic: string,
    messages: KafkaMessageObject[],
  ): Promise<RecordMetadata[]> {
    const result = await this.client.send({
      topic,
      messages,
    });
    return result;
  }
}
