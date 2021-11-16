import { Injectable } from '@nestjs/common';
import { BaseService, LoggerDebug } from 'src/common';
import { CleanStudyTaskService } from '../service/clean-study-task.service';
import { ScheduleAbstractFacadeService } from './schedule.abstract';

@Injectable()
export class ScheduleFacadeService
  extends BaseService
  implements ScheduleAbstractFacadeService
{
  constructor(private readonly cleanStudyTaskService: CleanStudyTaskService) {
    super(ScheduleFacadeService.name);
  }

  async demo() {
    await this.mqService.add(
      {
        queue: 'cleanStudyTask',
        topic: 'cleanStudyTask',
        tag: 'demo',
      },
      {
        // status: 1,
        name: 'clean-study-task',
        separateAt: new Date(),
      },
      { delay: 1000 },
    );
  }

  @LoggerDebug()
  async start() {
    this.cleanStudyTaskService.start();
  }
}
