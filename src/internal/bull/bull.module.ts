import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BULL_QUEUES } from 'src/external/mq/constant/constant';
import { BullConfigService } from './bull-config.service';

const bullQueueModule = BullModule.registerQueueAsync(
  ...BULL_QUEUES.map((e) => {
    return {
      name: e,
      useClass: BullConfigService,
    };
  }),
);

@Module({
  imports: [bullQueueModule],
  exports: [bullQueueModule],
})
export class MyBullModule {}
