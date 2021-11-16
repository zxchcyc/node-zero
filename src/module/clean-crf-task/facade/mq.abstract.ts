import { TaskLogBo } from 'src/module/task-log/bo/task-log.bo';
import { CrfBo, StudyBo } from '../bo/clean-crf-task.bo';

export abstract class MqAbstractFacadeService {
  abstract demo(taskLog: TaskLogBo): Promise<void>;
  abstract start(study: StudyBo): Promise<void>;
  abstract createTabel(crf: CrfBo): Promise<void>;
}
