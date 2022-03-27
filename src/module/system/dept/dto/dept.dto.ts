import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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

export class DeptDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  id: number;

  @IsString()
  @ApiProperty({ description: '部门名字' })
  name: string;

  @IsString()
  @ApiProperty({ description: '部门编码' })
  code: string;

  @IsString()
  @ApiProperty({ description: '部门ID链' })
  chain: string;

  @ApiProperty({ description: '上级部门ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  pid: number;

  @ApiProperty({ description: '部门深度', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  level: number;

  @ApiProperty({ description: '状态 1 启动 2 禁用', enum: EStatus })
  @IsEnum(EStatus)
  @Type(() => Number)
  status: EStatus;
}

export class FindDeptReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(DeptDto), ['name', 'code', 'status'] as const),
) {
  @ApiProperty({ description: 'ID数组(前端不传)', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform((v) => {
    if (typeof v.value === 'string') {
      return JSON.parse(v.value);
    } else {
      return v.value;
    }
  })
  @IsOptional()
  ids?: number[];
}

export class FindDeptResDto extends PickType(DeptDto, [
  'name',
  'code',
  'id',
  'pid',
  'status',
] as const) {}

export class CreateDeptReqDto extends IntersectionType(
  PickType(DeptDto, ['name', 'code'] as const),
  PickType(PartialType(DeptDto), ['pid', 'status'] as const),
) {}

export class FindOneDeptResDto extends PickType(DeptDto, [
  'name',
  'code',
  'id',
  'pid',
  'status',
] as const) {}

export class UpdateDeptReqDto extends PickType(PartialType(DeptDto), [
  'name',
  'code',
  'id',
  'pid',
  'status',
] as const) {}

export class BatchUpdateReqDto extends PickType(PartialType(DeptDto), [
  'status',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(DeptDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
