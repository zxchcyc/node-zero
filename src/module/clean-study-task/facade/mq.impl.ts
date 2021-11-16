import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { TaskLogBo } from 'src/module/task-log/bo/task-log.bo';
import { AbstractFacadeService } from 'src/module/task-log/facade/facade.abstract';
import { StudyBo } from '../bo/clean-study-task.bo';
import { CleanStudyTaskService } from '../service/clean-study-task.service';
import { MqAbstractFacadeService } from './mq.abstract';

@Injectable()
export class MqFacadeService
  extends BaseService
  implements MqAbstractFacadeService
{
  constructor(
    private readonly cleanStudyTaskService: CleanStudyTaskService,
    private readonly taskLogFacadeService: AbstractFacadeService,
  ) {
    super(MqFacadeService.name);
  }

  async demo(taskLog: TaskLogBo) {
    await this.taskLogFacadeService.save(taskLog);
  }
  async createDb(study: StudyBo) {
    await this.cleanStudyTaskService.createDb(study);
  }
}
