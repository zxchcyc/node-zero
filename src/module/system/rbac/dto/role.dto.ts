import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatus } from 'src/common';
import { ReqPaginatorDto } from 'src/common/dto';

export class RoleDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  id?: number;

  @IsString()
  @ApiProperty({ description: '名称' })
  name: string;

  @IsString()
  @ApiProperty({ description: '编码' })
  code: string;

  @ApiProperty({ description: '状态 1 启动 2 禁用', enum: EStatus })
  @IsEnum(EStatus)
  @Type(() => Number)
  status: EStatus;
}

export class FindRoleReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(RoleDto), ['name', 'code', 'status'] as const),
) {}

export class FindRoleResDto extends PickType(RoleDto, [
  'id',
  'name',
  'code',
  'status',
] as const) {}

export class PermissionGroupDto {
  @IsArray()
  @ApiProperty({ description: '权限包ID', type: [Number] })
  @IsNumber({}, { each: true })
  @IsOptional()
  pgids?: number[];
}

export class CreateRoleReqDto extends IntersectionType(
  PermissionGroupDto,
  PickType(RoleDto, ['name', 'code', 'status'] as const),
) {}

export class FindOneRoleResDto extends IntersectionType(
  PermissionGroupDto,
  PickType(RoleDto, ['id', 'name', 'code', 'status'] as const),
) {}

export class UpdateRoleReqDto extends IntersectionType(
  PermissionGroupDto,
  PickType(PartialType(RoleDto), ['name', 'code', 'status'] as const),
) {}

export class BatchUpdateReqDto extends PickType(PartialType(RoleDto), [
  'status',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(RoleDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
