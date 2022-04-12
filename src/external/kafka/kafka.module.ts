import { Module } from '@nestjs/common';
import { KafkaModule } from '@rob3000/nestjs-kafka';
import { EnvService } from '../../internal/env/env.service';
import { MyKafkaService } from './adapter/kafka.impl.service';
import { AbstractKafkaService } from './adapter/kafka.service.abstract';
import { KafkaConsumerService } from './consumer/consumer.service';

@Module({
  imports: [
    KafkaModule.registerAsync(['KAFKA_SERVICE'], {
      useFactory: (envService: EnvService) => {
        return [
          {
            name: 'KAFKA_SERVICE',
            options: {
              client: {
                clientId: 'node-zero',
                brokers: [envService.get('KAFKA_BROKER')],
                retry: {
                  retries: 2,
                  initialRetryTime: 30,
                },
              },
              consumer: {
                groupId: envService.get('KAFKA_GROUPID'),
                allowAutoTopicCreation: true,
              },
            },
          },
        ];
      },
      inject: [EnvService],
    }),
  ],
  providers: [
    {
      provide: AbstractKafkaService,
      useClass: MyKafkaService,
    },
    KafkaConsumerService,
  ],
  exports: [AbstractKafkaService, KafkaConsumerService],
})
export class MyKafkaModule {}
