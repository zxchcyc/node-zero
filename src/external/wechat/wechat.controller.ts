import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeChat } from '@tnwx/wxmp';
import { WechatMsgProcessor } from './wechat-msg-processor';

@ApiTags('Wechat')
@Controller('wechat/v1')
export class WechatController {
  constructor(private readonly wechatMsgProcessor: WechatMsgProcessor) {}

  @Get('/msg/callback')
  @ApiOperation({ summary: '首次设置服务器回调判断是否合法' })
  async handleMpToken(@Query() query) {
    return { result: { resType: 'wechat', data: query.echostr } };
  }

  @Post('/msg/callback')
  @ApiOperation({ summary: '公众号消息/事件回调处理' })
  async handleMpCallback(@Req() req) {
    // 获取签名相关的参数用于消息解密(测试号以及明文模式无此参数)
    const { signature, timestamp, nonce } = req.query;
    const msgXml = Buffer.from(req.body).toString('utf-8');
    // 处理消息并响应对应的回复
    const result = await WeChat.handleMsg(
      this.wechatMsgProcessor,
      msgXml,
      signature,
      timestamp,
      nonce,
    );
    return { result: { resType: 'wechat', data: result } };
  }
}
