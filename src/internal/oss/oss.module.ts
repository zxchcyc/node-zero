import { Module } from '@nestjs/common';
import { OssService } from './oss.service';

/**
 * http服务模块
 */
@Module({
  providers: [OssService],
  exports: [OssService],
})
export class OssModule {}
