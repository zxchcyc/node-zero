import { Module } from '@nestjs/common';
import { CosService } from './cos.service';
import { OssService } from './oss.service';

/**
 * http服务模块
 */
@Module({
  providers: [OssService, CosService],
  exports: [OssService, CosService],
})
export class OssModule {}
