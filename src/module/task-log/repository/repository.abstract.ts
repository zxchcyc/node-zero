import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';

export abstract class AbstractRepositoryService {
  abstract save(taskLog: TaskLogBo): Promise<void>;
  abstract find(query: GetPagingTaskLogBo): Promise<TaskLogBo[]>;
}
