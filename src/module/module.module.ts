import { Module } from '@nestjs/common';
import { CleanCrfTaskModule } from './clean-crf-task/clean-crf-task.module';
import { CleanStudyTaskModule } from './clean-study-task/clean-study-task.module';
import { TaskLogModule } from './task-log/task-log.module';

@Module({
  imports: [CleanCrfTaskModule, CleanStudyTaskModule, TaskLogModule],
  exports: [CleanCrfTaskModule, CleanStudyTaskModule, TaskLogModule],
  providers: [],
})
export class ModulesModule {}
