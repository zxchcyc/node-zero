import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { ReqPaginatorDto } from 'src/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatus } from '../enum/task-log.enum';

export class TaskLogDto {
  @ApiProperty({ description: '创建时间', type: Date })
  @IsDateString()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ description: '更新时间', type: Date })
  @IsDateString()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({ description: '数据库ID', type: String })
  _id: string | number;

  @ApiProperty({ description: '任务名称', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: '分割时间', type: Date })
  // @IsDateString()
  @IsDate()
  @Type(() => Date)
  separateAt: Date;

  @ApiProperty({ description: '状态', enum: [1, 2] })
  @Type(() => Number)
  @IsEnum(EStatus)
  @IsOptional()
  status: EStatus;
}

export class GetPagingTaskLogDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(TaskLogDto), ['name', 'separateAt', 'status'] as const),
) {}
