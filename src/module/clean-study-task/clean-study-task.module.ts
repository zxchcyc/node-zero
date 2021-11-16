import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskLogModule } from '../task-log/task-log.module';
import { BullProcessor } from './application/mq/bull.processor';
import { TagService } from './application/mq/tag.service';
import { ScheduleService } from './application/schedule/schedule.service';
import { MqAbstractFacadeService } from './facade/mq.abstract';
import { MqFacadeService } from './facade/mq.impl';
import { ScheduleAbstractFacadeService } from './facade/schedule.abstract';
import { ScheduleFacadeService } from './facade/schedule.impl';
import { EdcRepositoryService } from './repository/edc.impl';
import { EdcAbstractRepositoryService } from './repository/edc.abstract';
import { CleanStudyTaskService } from './service/clean-study-task.service';
import { CreateDbSchema, createDbSchema } from './repository/create-db.schema';
import { CreateDbAbstractRepositoryService } from './repository/create-db.abstract';
import { CreateDbRepositoryService } from './repository/create-db.impl';
import { DbAbstractRepositoryService } from './repository/db.abstract';
import { DbRepositoryService } from './repository/db.impl';
import { TypeOrmModule } from '@nestjs/typeorm';

const providers: any = [];
if (['1', 'true', 'TRUE'].includes(process.env.TASK_ENABLED)) {
  providers.push(
    BullProcessor,
    TagService,
    ScheduleService,
    CleanStudyTaskService,
    {
      provide: MqAbstractFacadeService,
      useClass: MqFacadeService,
    },
    {
      provide: ScheduleAbstractFacadeService,
      useClass: ScheduleFacadeService,
    },
    {
      provide: EdcAbstractRepositoryService,
      useClass: EdcRepositoryService,
    },
    {
      provide: CreateDbAbstractRepositoryService,
      useClass: CreateDbRepositoryService,
    },
    {
      provide: DbAbstractRepositoryService,
      useClass: DbRepositoryService,
    },
  );
}

@Module({
  imports: [
    TaskLogModule,
    TypeOrmModule.forFeature([], 'mysql'),
    MongooseModule.forFeature(
      [
        {
          name: CreateDbSchema.name,
          schema: createDbSchema,
        },
      ],
      'mongo-edc-dw',
    ),
    MongooseModule.forFeature([], 'mongo-edc'),
  ],
  controllers: [],
  providers,
  exports: [],
})
export class CleanStudyTaskModule {}
