import { CrfDto, StudyDto } from '../dto/clean-crf-task.dto';
import { EEdcFieldType } from '../enum/clean-crf-task.enum';

export class StudyBo extends StudyDto {}
export class CrfBo extends CrfDto {}

export class CrfFieldBo {
  formCode: string;
  sdtmCode: string;
  type: EEdcFieldType;
  formName: string;
  fieldName: string;
}
