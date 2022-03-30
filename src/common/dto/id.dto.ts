import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IdResDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsOptional()
  @Type(() => Number)
  id: number;
}

export class IdReqDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNumber()
  @Type(() => Number)
  id: number;
}
