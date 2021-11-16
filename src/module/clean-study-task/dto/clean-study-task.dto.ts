import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EStatus } from '../enum/clean-study-task.enum';

export class StudyDto {
  @ApiProperty({ description: '项目id', type: String })
  @IsString()
  studyid: string;

  @ApiProperty({ description: '状态', enum: [1, 2] })
  @Type(() => Number)
  @IsEnum(EStatus)
  @IsOptional()
  status: EStatus;
}
