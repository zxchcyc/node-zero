import { Module } from '@nestjs/common';
import { BullmqService } from './adapter/bullmq.impl.service';
import { AbstractBullMqService } from './adapter/bullmq.service.abstract';

@Module({
  providers: [
    {
      provide: AbstractBullMqService,
      useClass: BullmqService,
    },
  ],
  exports: [AbstractBullMqService],
})
export class BullmqModule {}
