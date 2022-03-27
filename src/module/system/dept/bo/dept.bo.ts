import { PartialType } from '@nestjs/swagger';
import {
  DeptDto,
  FindDeptReqDto,
  FindDeptResDto,
  CreateDeptReqDto,
  FindOneDeptResDto,
  UpdateDeptReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/dept.dto';

export class DeptBo extends DeptDto {}
export class FindDeptReqBo extends FindDeptReqDto {}
export class FindDeptResBo extends PartialType(FindDeptResDto) {
  chain?: string;
  level?: number;
}
export class CreateDeptReqBo extends CreateDeptReqDto {
  chain?: string;
  level?: number;
}
export class FindOneDeptResBo extends FindOneDeptResDto {
  chain?: string;
  level?: number;
}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateDeptReqBo extends UpdateDeptReqDto {
  chain?: string;
  level?: number;
}
