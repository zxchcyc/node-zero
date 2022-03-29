import { PartialType } from '@nestjs/swagger';
import {
  DictDto,
  FindDictReqDto,
  FindDictResDto,
  CreateDictReqDto,
  FindOneDictResDto,
  UpdateDictReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/dict.dto';

export class DictBo extends DictDto {}
export class FindDictReqBo extends FindDictReqDto {}
export class FindDictResBo extends PartialType(FindDictResDto) {}
export class CreateDictReqBo extends CreateDictReqDto {}
export class FindOneDictResBo extends FindOneDictResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateDictReqBo extends UpdateDictReqDto {}
