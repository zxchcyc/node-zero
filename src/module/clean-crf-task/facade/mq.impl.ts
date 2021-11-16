import { Injectable } from '@nestjs/common';
import { BaseService, LoggerDebug } from 'src/common';
import { TaskLogBo } from 'src/module/task-log/bo/task-log.bo';
import { AbstractFacadeService } from 'src/module/task-log/facade/facade.abstract';
import { CrfBo, StudyBo } from '../bo/clean-crf-task.bo';
import { CleanCrfTaskService } from '../service/clean-crf-task.service';
import { MqAbstractFacadeService } from './mq.abstract';

@Injectable()
export class MqFacadeService
  extends BaseService
  implements MqAbstractFacadeService
{
  constructor(
    private readonly cleanCrfTaskService: CleanCrfTaskService,
    private readonly taskLogFacadeService: AbstractFacadeService,
  ) {
    super(MqFacadeService.name);
  }

  async demo(taskLog: TaskLogBo) {
    await this.taskLogFacadeService.save(taskLog);
  }

  @LoggerDebug()
  async start(study: StudyBo) {
    await this.cleanCrfTaskService.start(study);
  }

  @LoggerDebug()
  async createTabel(crf: CrfBo) {
    await this.cleanCrfTaskService.createTabel(crf);
  }
}
