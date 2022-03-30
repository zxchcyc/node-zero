import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class PermissionDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  @ApiProperty({ description: '名称' })
  name: string;

  @IsString()
  @ApiProperty({ description: '编码' })
  code: string;

  @IsString()
  @ApiProperty({ description: '种类' })
  kind: string;

  @ApiProperty({ description: '权限包顺序', type: Number })
  @Type(() => Number)
  seq: number;

  @ApiProperty({ description: '权限包种类顺序', type: Number })
  @Type(() => Number)
  seqKind: number;
}

export class FindPermissionResDto extends PickType(PermissionDto, [
  'name',
  'code',
  'kind',
  'seq',
  'seqKind',
] as const) {}
