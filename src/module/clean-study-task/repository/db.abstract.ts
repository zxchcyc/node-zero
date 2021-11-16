import { DbBo, StudyBo } from '../bo/clean-study-task.bo';

export abstract class DbAbstractRepositoryService {
  abstract createdDb(study: StudyBo): Promise<DbBo>;
  abstract lock(db: DbBo): Promise<void>;
  abstract unlock(db: DbBo): Promise<void>;
}
