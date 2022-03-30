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
import { EMsgStatus, EMsgTag, EReadStatus } from '../enum/msg.enum';

export class MsgDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: '发送状态 1 发送成功 2 发送失败',
    enum: [EMsgStatus],
  })
  @IsEnum(EMsgStatus)
  @IsNumber()
  @Type(() => Number)
  readonly status?: EMsgStatus;

  @ApiProperty({ description: '已读状态 1 已读 2 未读', enum: [EReadStatus] })
  @IsEnum(EReadStatus)
  @IsNumber()
  @Type(() => Number)
  readonly read: EReadStatus;

  @ApiProperty({ description: '消息标签 ', enum: [EMsgTag] })
  @IsEnum(EMsgTag)
  @IsNumber()
  @Type(() => Number)
  tag: EMsgTag;

  @IsString()
  @ApiProperty({ description: '消息标题' })
  title: string;

  @IsString()
  @ApiProperty({ description: '消息内容' })
  content: string;

  @IsString()
  @ApiProperty({ description: '落地参数' })
  attached: string;

  @IsNumber()
  @ApiProperty({ description: '用户id' })
  @Type(() => Number)
  uid: number;
}

export class FindMsgReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(MsgDto), ['uid', 'tag', 'read'] as const),
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

export class FindMsgResDto extends PickType(MsgDto, [
  'id',
  'status',
  'read',
  'tag',
  'title',
  'content',
  'attached',
  'uid',
] as const) {}

export class CreateMsgReqDto extends IntersectionType(
  PickType(MsgDto, ['tag', 'title', 'content', 'attached', 'uid'] as const),
  PickType(PartialType(MsgDto), ['read', 'status'] as const),
) {}

export class FindOneMsgResDto extends PickType(MsgDto, [
  'id',
  'status',
  'read',
  'tag',
  'title',
  'content',
  'attached',
  'uid',
] as const) {}

export class UpdateMsgReqDto extends PickType(PartialType(MsgDto), [
  'read',
] as const) {}

export class BatchUpdateReqDto extends PickType(PartialType(MsgDto), [
  'read',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(MsgDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
