import { Module } from '@nestjs/common';
import { KafkaModule } from '@rob3000/nestjs-kafka';
import { EnvService } from '../../internal/env/env.service';
import { KafkaConsumerService } from './consumer.service';
import { KafkaProducerService } from './Producer.service';

@Module({
  imports: [
    KafkaModule.registerAsync(['KAFKA_SERVICE'], {
      useFactory: (envService: EnvService) => {
        const broker = envService.get('KAFKA_BROKER');
        return [
          {
            name: 'KAFKA_SERVICE',
            options: {
              client: {
                clientId: 'node-zero',
                brokers: [broker],
                retry: {
                  retries: 2,
                  initialRetryTime: 30,
                },
              },
              consumer: {
                groupId: 'node-zero-consumer',
                allowAutoTopicCreation: true,
              },
            },
          },
        ];
      },
      inject: [EnvService],
    }),
  ],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService],
})
export class MyKafkaModule {}
