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
  id: number;

  @IsString()
  @ApiProperty({ description: '名称' })
  name: string;

  @IsString()
  @ApiProperty({ description: '编码' })
  code: string;

  @ApiProperty({ description: '状态 1 启动 2 禁用', enum: EStatus })
  @IsEnum(EStatus)
  @Type(() => Number)
  @IsOptional()
  status?: EStatus;
}

export class FindRoleReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(RoleDto), ['name', 'code', 'status'] as const),
) {}

export class FindRoleResDto extends PickType(RoleDto, [
  'name',
  'code',
  'status',
] as const) {}

export class CreateRoleReqDto extends PickType(RoleDto, [
  'name',
  'code',
  'status',
] as const) {}

export class FindOneRoleResDto extends PickType(RoleDto, [
  'name',
  'code',
  'status',
] as const) {}

export class UpdateRoleReqDto extends PickType(PartialType(RoleDto), [
  'name',
  'code',
  'status',
] as const) {}

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
