import { Inject, Injectable, Logger } from '@nestjs/common';
import { IHeaders, KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';

@Injectable()
export class KafkaConsumerService {
  private readonly logger: Logger = new Logger(KafkaConsumerService.name);

  constructor(@Inject('KAFKA_SERVICE') private client: KafkaService) {}

  onModuleInit(): void {
    this.client.subscribeToResponseOf('node-zero', this);
  }

  @SubscribeTo('node-zero')
  async getWorld(
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
