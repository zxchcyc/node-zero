import { Module } from '@nestjs/common';
import { HttpService } from './http.service';

/**
 * http服务模块
 */
@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class MyHttpModule {}
