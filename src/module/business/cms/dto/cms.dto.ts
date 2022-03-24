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
import { ReqPaginatorDto } from 'src/common/dto';
import { ECmsStatus, ECmsType } from '../enum/cms.enum';

export class CmsDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '序号', type: Number })
  @IsNotEmpty()
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '置顶(1置顶 0不置顶)', type: Number })
  @IsNotEmpty()
  @IsOptional()
  isTop?: number;

  @ApiProperty({ description: '是否结束(1结束 0没结束)', type: Number })
  @IsNotEmpty()
  @IsOptional()
  finish?: number;

  @IsString()
  @ApiProperty({ description: '内容' })
  content: string;

  @IsString()
  @ApiProperty({ description: '视频' })
  @IsOptional()
  video?: string;

  @IsString()
  @ApiProperty({ description: '标题' })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({ description: '封面' })
  @IsOptional()
  cover?: string;

  @ApiProperty({ description: '状态 1 已发布 2 未发布', enum: ECmsStatus })
  @IsEnum(ECmsStatus)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  status?: ECmsStatus;

  @ApiProperty({
    description:
      'CMS类型 1 文章 2 科普 3 学术 4 优惠政策 5 积分规则 6会员等级 7经销商发现',
    enum: ECmsType,
  })
  @IsEnum(ECmsType)
  @Type(() => Number)
  @IsOptional()
  readonly type?: ECmsType;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '发布时间', format: 'date-time' })
  pubAt?: Date;
}

export class FindCmsReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(CmsDto), ['title', 'type', 'finish', 'status'] as const),
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

export class FindCmsResDto extends PickType(CmsDto, [
  'title',
  'status',
  'id',
  'sort',
  'isTop',
  'pubAt',
  'cover',
  'content',
] as const) {}

export class CreateCmsReqDto extends PickType(CmsDto, [
  'type',
  'title',
  'cover',
  'video',
  'content',
  'finish',
  'pubAt',
] as const) {}

export class FindOneCmsResDto extends PickType(CmsDto, [
  'type',
  'title',
  'cover',
  'video',
  'content',
  'finish',
] as const) {}

export class UpdateCmsReqDto extends PickType(PartialType(CmsDto), [
  'type',
  'title',
  'cover',
  'video',
  'content',
  'finish',
  'isTop',
  'sort',
  'status',
] as const) {}

export class BatchUpdateReqDto extends PickType(PartialType(CmsDto), [
  'status',
  'isTop',
  'sort',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(CmsDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
