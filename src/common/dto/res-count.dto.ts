import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CountResDto {
  @ApiProperty({
    description: '总数',
    type: 'integer',
  })
  @IsInt()
  readonly total: number;
}
