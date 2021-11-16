import { EStatus } from 'src/module/task-log/enum/task-log.enum';
import { CreateDbBo } from '../bo/clean-study-task.bo';

export abstract class CreateDbAbstractRepositoryService {
  abstract save(createDb: CreateDbBo): Promise<CreateDbBo>;
  abstract findOne(studyid: string): Promise<CreateDbBo>;
  abstract updateStatus(_id: string, status: EStatus): Promise<void>;
}
