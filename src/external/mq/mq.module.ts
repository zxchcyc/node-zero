import { Module } from '@nestjs/common';
import { MqBullService } from './adapter/mq-bull.impl.service';
import { AbstractMqService } from './adapter/mq.service.abstract';

@Module({
  providers: [
    {
      provide: AbstractMqService,
      useClass: MqBullService,
    },
  ],
  exports: [AbstractMqService],
})
export class MqModule {}
