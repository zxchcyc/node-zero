import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import { CustomServiceApi } from 'tnwx';
import { WechatPublicService } from './wechat-public.service';

@Injectable()
export class WechatMsgService {
  constructor(
    private readonly envService: EnvService,
    private readonly wechatPublicService: WechatPublicService,
  ) {}

  async deal(toUser: string, eventKey: string) {
    eventKey = eventKey.replace('qrscene_', '');
    // 场景值合法性检测
    if (!eventKey) {
      // 只要关注就发消息
      // return 'success';
      eventKey = undefined;
    }
    // 经销商推广码
    const title = `感谢关注❤️
各地区产品合作请留言，我们会在第一时间回复。

为回馈新老客户，终端客户首次认证通过，将赠送价值50元小礼物。购进产品获积分，积分兑好礼！快来加入我们吧！

`;
    const appid = this.envService.get('WECHAT_MINI_APPID');
    const page = `pages/Home/index?refCode=${eventKey}`;
    const text = `${title}<a href="http://www.qq.com" data-miniprogram-appid=${appid} data-miniprogram-path=${page}>点击跳小程序</a>`;
    await CustomServiceApi.sendText(toUser, text);
    const unionid = await this.wechatPublicService.getUnionid(toUser);
    if (unionid) {
      // 保存绑定关系
    }
  }
}
