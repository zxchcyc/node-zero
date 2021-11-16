import { StudyBo } from '../bo/clean-study-task.bo';

export abstract class EdcAbstractRepositoryService {
  abstract getStudys(): Promise<StudyBo[]>;
}
