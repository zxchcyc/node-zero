import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common';
import { Repository } from 'typeorm';
import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';
import { AbstractRepositoryService } from './repository.abstract';
import { TaskLogEntity } from './task-log.entity';

@Injectable()
export class RepositoryService
  extends BaseService
  implements AbstractRepositoryService
{
  constructor(
    @InjectRepository(TaskLogEntity, 'mysql')
    private readonly taskLogRepository: Repository<TaskLogEntity>,
  ) {
    super(RepositoryService.name);
  }

  async find(query: GetPagingTaskLogBo): Promise<TaskLogBo[]> {
    this.logger.log('===', query);
    const result = await this.taskLogRepository.find(
      this._.pick(query, ['name']),
    );
    this.logger.log('===', result);
    return result;
  }

  async save(taskLog: TaskLogBo): Promise<void> {
    this.logger.log('===', taskLog);
    await this.taskLogRepository.save(taskLog as TaskLogEntity);
  }
}
