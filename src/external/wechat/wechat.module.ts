import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WechatMsgProcessor } from './wechat-msg-processor';
import { WechatMiniService } from './wechat-mini.service';
import { WechatPublicService } from './wechat-public.service';
import { WechatController } from './wechat.controller';
import { RawBodyMiddleware } from 'src/common';
import { WechatMsgService } from './wechat-msg.service';

@Module({
  imports: [],
  controllers: [WechatController],
  providers: [
    WechatMiniService,
    WechatPublicService,
    WechatMsgProcessor,
    WechatMsgService,
  ],
  exports: [WechatMiniService, WechatPublicService],
})
export class WechatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RawBodyMiddleware).forRoutes(WechatController);
  }
}
