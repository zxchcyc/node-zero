import { Module } from '@nestjs/common';
import { KafkaModule } from '@rob3000/nestjs-kafka';
import { EnvService } from '../env/env.service';

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
                clientId: 'test-e2e',
                brokers: [broker],
                retry: {
                  retries: 2,
                  initialRetryTime: 30,
                },
              },
              consumer: {
                groupId: 'test-e2e-consumer',
                allowAutoTopicCreation: true,
              },
            },
          },
        ];
      },
      inject: [EnvService],
    }),
  ],
})
export class MyKafkaModule {}
