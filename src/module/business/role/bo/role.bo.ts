import { PartialType } from '@nestjs/swagger';
import {
  RoleDto,
  FindRoleReqDto,
  FindRoleResDto,
  CreateRoleReqDto,
  FindOneRoleResDto,
  UpdateRoleReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/role.dto';

export class RoleBo extends RoleDto {}
export class FindRoleReqBo extends FindRoleReqDto {}
export class FindRoleResBo extends PartialType(FindRoleResDto) {}
export class CreateRoleReqBo extends CreateRoleReqDto {}
export class FindOneRoleResBo extends FindOneRoleResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateRoleReqBo extends UpdateRoleReqDto {
  pubAt?: Date;
}
