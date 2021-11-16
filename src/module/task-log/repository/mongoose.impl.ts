import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService, LoggerDebug } from 'src/common';
import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';
import { AbstractRepositoryService } from './repository.abstract';
import { TaskLogSchema } from './task-log.schema';

@Injectable()
export class RepositoryService
  extends BaseService
  implements AbstractRepositoryService
{
  constructor(
    @InjectModel(TaskLogSchema.name)
    private readonly taskLogModel: Model<TaskLogSchema>,
  ) {
    super(RepositoryService.name);
  }

  @LoggerDebug()
  async find(query: GetPagingTaskLogBo): Promise<TaskLogBo[]> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    return await this.taskLogModel
      .find(
        this._.pick(query, ['name']),
        {},
        {
          limit,
          skip,
          lean: true,
        },
      )
      .exec();
  }

  async save(taskLog: TaskLogBo): Promise<void> {
    await this.taskLogModel.create(taskLog);
  }
}
