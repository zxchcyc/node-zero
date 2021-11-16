import { Global, Module } from '@nestjs/common';
import { MyHttpModule } from './http/http.module';
import { WebhookModule } from './webhook/webhook.module';
import { MqModule } from './mq/mq.module';

@Global()
@Module({
  imports: [MyHttpModule, WebhookModule, MqModule],
  exports: [MyHttpModule, WebhookModule, MqModule],
})
export class ExternalModule {}
