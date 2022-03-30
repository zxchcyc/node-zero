import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReqPaginatorDto } from 'src/common/dto';

export class RegionDto {
  @IsString()
  @ApiProperty({ description: '行政区域名字' })
  name: string;

  @IsString()
  @ApiProperty({ description: '行政区域编码' })
  code: string;

  @IsString()
  @ApiProperty({ description: '行政区域上级编码' })
  pCode: string;

  @IsString()
  @ApiProperty({ description: '行政区域编码链' })
  chain: string;

  @ApiProperty({ description: '行政区域深度', type: Number })
  @IsNumber()
  @Type(() => Number)
  level: number;
}

export class FindRegionReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(RegionDto), ['name', 'code', 'pCode'] as const),
) {
  @IsOptional()
  @Transform((v) =>
    v.value === 'true' ? true : v.value === 'false' ? false : v,
  )
  @IsBoolean()
  @ApiProperty({ description: '是否展开' })
  expand?: boolean = false;
}

export class FindRegionResDto extends PickType(RegionDto, [
  'name',
  'code',
  'pCode',
  'chain',
  'level',
] as const) {}
