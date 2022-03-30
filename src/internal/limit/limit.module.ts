import { Module } from '@nestjs/common';
import { LimitService } from './limit.service';

@Module({
  providers: [LimitService],
  exports: [LimitService],
})
export class LimitModule {}
