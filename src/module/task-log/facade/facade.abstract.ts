import { IPaginator } from 'src/common';
import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';

export abstract class AbstractFacadeService {
  abstract save(taskLog: TaskLogBo): Promise<void>;
  abstract getPaging(query: GetPagingTaskLogBo): Promise<IPaginator<TaskLogBo>>;
}
