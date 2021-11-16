import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';
import { AbstractRepositoryService } from '../repository/repository.abstract';

@Injectable()
export class TaskLogService extends BaseService {
  constructor(private readonly repositoryService: AbstractRepositoryService) {
    super(TaskLogService.name);
  }

  async save(taskLog: TaskLogBo) {
    await this.repositoryService.save(taskLog);
  }

  async find(query: GetPagingTaskLogBo): Promise<TaskLogBo[]> {
    return await this.repositoryService.find(query);
  }
}
