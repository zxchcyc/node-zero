import { StudyDto } from '../dto/clean-study-task.dto';
import { EStatus } from '../enum/clean-study-task.enum';

export class StudyBo extends StudyDto {}

export type CreateDbBo = {
  _id?: string;
  studyid: string;
  status: EStatus;
  user: string;
  password: string;
};

export type DbBo = {
  studyid?: string;
  user: string;
  password?: string;
};
