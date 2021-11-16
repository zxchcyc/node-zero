import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Max, Min, IsInt, IsString } from 'class-validator';

export class ReqPaginatorDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  @ApiProperty({
    description: '获取起始页',
    type: 'integer',
  })
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @ApiProperty({
    description: '获取一页数量',
    type: 'integer',
  })
  readonly limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '排序设置，如：age:-1,time:1',
    example: '',
  })
  readonly sort?: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '获取想要的属性（根据业务需要实现），如：name',
    example: '',
  })
  readonly attr?: string = '';
}
