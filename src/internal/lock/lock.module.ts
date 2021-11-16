import { Module } from '@nestjs/common';
import { LockService } from './lock.service';

@Module({
  providers: [LockService],
  exports: [LockService],
})
export class LockModule {}
