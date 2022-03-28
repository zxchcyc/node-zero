import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPostPolicyReqDto {
  @ApiProperty({ description: 'prefix' })
  @IsString()
  prefix: string;
}

export class GetPostPolicyResDto {
  @ApiProperty({ description: 'accessid' })
  accessid: string;
  @ApiProperty({ description: '上传域名' })
  host: string;
  @ApiProperty({ description: '上传策略' })
  policy: string;
  @ApiProperty({ description: '策略签名' })
  signature: string;
  @ApiProperty({ description: '过期时间（5分钟）', type: 'integer' })
  expire: number;
  @ApiProperty({ description: '回调策略' })
  callback: string;
  @ApiProperty({ description: '上传目录' })
  dir: string;
}
