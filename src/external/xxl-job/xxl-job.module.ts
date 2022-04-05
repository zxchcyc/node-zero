import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BullTagService } from './bullmq/bull-tag.service';
import { BullProcessor } from './bullmq/bull.processor';
import { XxljobController } from './xxl-job.controller';
import { XxljobMiddleware } from './xxl-job.middleware';
import { XxljobService } from './xxl-job.service';

@Module({
  imports: [],
  controllers: [XxljobController],
  providers: [XxljobService, BullTagService, BullProcessor],
  exports: [],
})
export class XxljobModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XxljobMiddleware).forRoutes(XxljobController);
  }
}
