import { Module } from '@nestjs/common';
import { MyHttpModule } from '../http/http.module';
import { WebhookService } from './webhook.service';

/**
 * webhook 服务模块
 */
@Module({
  imports: [MyHttpModule],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
