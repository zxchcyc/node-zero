import { Inject, Injectable } from '@nestjs/common';
import { IHeaders, KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { BaseService } from 'src/common';

@Injectable()
export class KafkaConsumerService extends BaseService {
  constructor(@Inject('KAFKA_SERVICE') private client: KafkaService) {
    super(KafkaConsumerService.name);
  }

  onModuleInit(): void {
    this.client.subscribeToResponseOf('node_zero_canal', this);
  }

  @SubscribeTo('node_zero_canal')
  async getCanal(
    data: any,
    key: any,
    offset: number,
    timestamp: number,
    partition: number,
    headers: IHeaders,
  ): Promise<void> {
    this.logger.debug(data, key, offset, timestamp, partition, headers);
    return;
  }
}
