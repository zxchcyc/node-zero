import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoTagService } from './rocketmq/tag.service';

@Module({
  imports: [],
  providers: [DemoService, DemoTagService],
  exports: [DemoTagService],
})
export class DemoModule {}
