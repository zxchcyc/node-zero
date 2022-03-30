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
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReqPaginatorDto } from 'src/common/dto';
import { ETemplateStatus, ETemplateType } from '../enum/template.enum';

export class TemplateDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '序号', type: Number })
  @IsOptional()
  sort?: number;

  @ApiProperty({ description: '置顶(1置顶 0不置顶)', type: Number })
  @IsOptional()
  isTop?: number;

  @ApiProperty({ description: '是否结束(1结束 0没结束)', type: Number })
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

  @ApiProperty({ description: '状态 1 已发布 2 未发布', enum: ETemplateStatus })
  @IsEnum(ETemplateStatus)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  status?: ETemplateStatus;

  @ApiProperty({
    description: 'CMS类型 1 文章 2 科普 3 学术 4 优惠政策 5 积分规则 6会员等级',
    enum: ETemplateType,
  })
  @IsEnum(ETemplateType)
  @Type(() => Number)
  @IsOptional()
  readonly type?: ETemplateType;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '发布时间', format: 'date-time' })
  pubAt?: Date;
}

export class FindTemplateReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(TemplateDto), [
    'title',
    'type',
    'finish',
    'status',
  ] as const),
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

export class FindTemplateResDto extends PickType(TemplateDto, [
  'title',
  'status',
  'id',
  'sort',
  'isTop',
  'pubAt',
  'cover',
  'content',
] as const) {}

export class CreateTemplateReqDto extends PickType(TemplateDto, [
  'type',
  'title',
  'cover',
  'video',
  'content',
  'finish',
  'pubAt',
] as const) {}

export class FindOneTemplateResDto extends PickType(TemplateDto, [
  'type',
  'title',
  'cover',
  'video',
  'content',
  'finish',
] as const) {}

export class UpdateTemplateReqDto extends PickType(PartialType(TemplateDto), [
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

export class BatchUpdateReqDto extends PickType(PartialType(TemplateDto), [
  'status',
  'isTop',
  'sort',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(TemplateDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
