import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ECrfStatus, EStatus } from '../enum/clean-crf-task.enum';

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

export class CrfDto {
  @ApiProperty({ description: '项目id', type: String })
  @IsString()
  studyid: string;

  @ApiProperty({ description: 'CRF id', type: String })
  @IsString()
  crfid: string;

  @ApiProperty({ description: 'CRF 环境', type: String })
  @IsString()
  env: string;

  @ApiProperty({ description: 'CRF 版本', type: String })
  @IsString()
  version: string;

  @ApiProperty({ description: 'CRF 状态', enum: ['opened', 'closed'] })
  @IsEnum(ECrfStatus)
  @IsOptional()
  status: ECrfStatus;
}
