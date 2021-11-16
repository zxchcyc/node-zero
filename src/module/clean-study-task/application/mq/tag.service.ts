import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { TaskLogDto } from 'src/module/task-log/dto/task-log.dto';
import { StudyBo } from '../../bo/clean-study-task.bo';
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

  @MQTag(['createDb'])
  @MQValidate()
  async createDb(study: StudyBo) {
    this.mqFacadeService.createDb(study);
  }
}
