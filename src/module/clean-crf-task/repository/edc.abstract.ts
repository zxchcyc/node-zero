import { CrfBo, CrfFieldBo } from '../bo/clean-crf-task.bo';

export abstract class EdcAbstractRepositoryService {
  abstract getCrfs(studyid: string): Promise<CrfBo[]>;
  abstract getCrfFields(crfid: string): Promise<CrfFieldBo[]>;
}
