import { MyHttpModule } from './../http/http.module';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

/**
 * sms 服务模块
 */
@Module({
  imports: [MyHttpModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
