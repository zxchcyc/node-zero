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
  IsString,
} from 'class-validator';
import { EStatus } from 'src/common';
import { ReqPaginatorDto } from 'src/common/dto';

export class DictDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '序号', type: Number })
  @IsNotEmpty()
  sort: number;

  @IsString()
  @ApiProperty({ description: '字典类型' })
  type: string;

  @IsString()
  @ApiProperty({ description: '字典键' })
  key: string;

  @ApiProperty({ description: '字典值', type: Number })
  @IsNotEmpty()
  value: number;

  @IsString()
  @ApiProperty({ description: '中文简体' })
  textZhHans: string;

  @IsString()
  @ApiProperty({ description: '中文繁体' })
  textZhHant: string;

  @IsString()
  @ApiProperty({ description: '英文' })
  textEn: string;

  @ApiProperty({ description: '状态 1 启动 2 禁用', enum: EStatus })
  @IsEnum(EStatus)
  @Type(() => Number)
  status: EStatus;
}

export class FindDictReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(DictDto), ['type', 'status'] as const),
) {}

export class FindDictResDto extends PickType(DictDto, [
  'id',
  'status',
  'sort',
  'type',
  'key',
  'value',
  'textZhHans',
  'textZhHant',
  'textEn',
] as const) {}

export class CreateDictReqDto extends PickType(DictDto, [
  'status',
  'sort',
  'type',
  'key',
  'value',
  'textZhHans',
  'textZhHant',
  'textEn',
] as const) {}

export class FindOneDictResDto extends PickType(DictDto, [
  'status',
  'sort',
  'type',
  'key',
  'value',
  'textZhHans',
  'textZhHant',
  'textEn',
] as const) {}

export class UpdateDictReqDto extends PickType(PartialType(DictDto), [
  'status',
  'sort',
  'type',
  'key',
  'value',
  'textZhHans',
  'textZhHant',
  'textEn',
] as const) {}

export class BatchUpdateReqDto extends PickType(PartialType(DictDto), [
  'status',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(DictDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
