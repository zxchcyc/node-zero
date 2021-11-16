import { TaskLogBo } from 'src/module/task-log/bo/task-log.bo';
import { StudyBo } from '../bo/clean-study-task.bo';

export abstract class MqAbstractFacadeService {
  abstract demo(taskLog: TaskLogBo): Promise<void>;
  abstract createDb(study: StudyBo): Promise<void>;
}
