import { Global, Module } from '@nestjs/common';
import { MyHttpModule } from './http/http.module';
import { WebhookModule } from './webhook/webhook.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { WechatModule } from './wechat/wechat.module';
import { SmsModule } from './sms/sms.module';
import { RowCacheModule } from './row-cache/row-cache.module';
import { OcrModule } from './ocr/ocr.module';
import { WebsocketModule } from './websocket/websocket.module';
import { RocketmqModule } from './rocketmq/rocketmq.module';

@Global()
@Module({
  imports: [
    MyHttpModule,
    WebhookModule,
    BullmqModule,
    RocketmqModule,
    WechatModule,
    SmsModule,
    RowCacheModule,
    OcrModule,
    WebsocketModule,
  ],
  exports: [
    MyHttpModule,
    WebhookModule,
    BullmqModule,
    RocketmqModule,
    WechatModule,
    SmsModule,
    RowCacheModule,
    OcrModule,
    WebsocketModule,
  ],
})
export class ExternalModule {}
