import { Injectable } from '@nestjs/common';
import { BaseService, IPaginator } from 'src/common';
import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';
import { TaskLogService } from '../service/task-log.service';
import { AbstractFacadeService } from './facade.abstract';

@Injectable()
export class FacadeService
  extends BaseService
  implements AbstractFacadeService
{
  constructor(private readonly taskLogService: TaskLogService) {
    super(FacadeService.name);
  }

  async save(taskLog: TaskLogBo) {
    this.taskLogService.save(taskLog);
  }

  async getPaging(query: GetPagingTaskLogBo): Promise<IPaginator<TaskLogBo>> {
    const { page, limit } = query;
    const taskLogs = await this.taskLogService.find(query);
    const result = {
      data: taskLogs.slice((page - 1) * limit, page * limit),
      total: taskLogs.length,
    };
    return result;
  }
}
