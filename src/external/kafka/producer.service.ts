import { Inject, Injectable } from '@nestjs/common';
import { KafkaService } from '@rob3000/nestjs-kafka';
import { RecordMetadata } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  constructor(@Inject('KAFKA_SERVICE') private client: KafkaService) {}

  async post(message = 'Hello world'): Promise<RecordMetadata[]> {
    const TOPIC_NAME = 'node-zero';
    const result = await this.client.send({
      topic: TOPIC_NAME,
      messages: [
        {
          key: '1',
          value: message,
        },
      ],
    });
    return result;
  }
}
