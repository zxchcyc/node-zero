import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogModule } from '../task-log/task-log.module';
import { BullProcessor } from './application/mq/bull.processor';
import { TagService } from './application/mq/tag.service';
import { MqAbstractFacadeService } from './facade/mq.abstract';
import { MqFacadeService } from './facade/mq.impl';
import { EdcAbstractRepositoryService } from './repository/edc.abstract';
import { EdcRepositoryService } from './repository/edc.impl';
import { TableAbstractRepositoryService } from './repository/table.abstract';
import { TableRepositoryService } from './repository/table.impl';
import { CleanCrfTaskService } from './service/clean-crf-task.service';

const providers: any = [];
if (['1', 'true', 'TRUE'].includes(process.env.TASK_ENABLED)) {
  providers.push(
    CleanCrfTaskService,
    BullProcessor,
    TagService,
    {
      provide: EdcAbstractRepositoryService,
      useClass: EdcRepositoryService,
    },
    {
      provide: TableAbstractRepositoryService,
      useClass: TableRepositoryService,
    },
    {
      provide: MqAbstractFacadeService,
      useClass: MqFacadeService,
    },
  );
}

@Module({
  imports: [
    TaskLogModule,
    TypeOrmModule.forFeature([], 'mysql'),
    MongooseModule.forFeature([], 'mongo-edc'),
  ],
  controllers: [],
  providers,
  exports: [],
})
export class CleanCrfTaskModule {}
