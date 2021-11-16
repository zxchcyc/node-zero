import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { TaskLogDto } from 'src/module/task-log/dto/task-log.dto';
import { CrfBo, StudyBo } from '../../bo/clean-crf-task.bo';
import { MqAbstractFacadeService } from '../../facade/mq.abstract';

@Injectable()
export class TagService extends BaseService {
  constructor(private readonly mqFacadeService: MqAbstractFacadeService) {
    super(TagService.name);
  }

  @MQTag(['demo'])
  @MQValidate()
  async demo(taskLog: TaskLogDto) {
    this.mqFacadeService.demo(taskLog);
  }

  @MQTag(['start'])
  @MQValidate()
  async start(study: StudyBo) {
    this.mqFacadeService.start(study);
  }

  @MQTag(['createTabel'])
  @MQValidate()
  async createTabel(crf: CrfBo) {
    this.mqFacadeService.createTabel(crf);
  }
}
