import { BadRequestException, Injectable } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import {
  AccessTokenApi,
  ApiConfigKit,
  ApiConfig,
  TemplateData,
  TemplateApi,
  MiniProgram,
  AccessToken,
} from 'tnwx';
import { HttpService } from '../http/http.service';
const PUBLICURL = 'https://api.weixin.qq.com/cgi-bin/';
// https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET
// TICKET记得进行UrlEncode
@Injectable()
export class WechatPublicService {
  private appId: string;
  private secret: string;
  private token: string;
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {
    this.appId = this.envService.get('WECHAT_PUBLIC_APPID');
    this.secret = this.envService.get('WECHAT_PUBLIC_SECRET');
    this.token = this.envService.get('WECHAT_PUBLIC_TOKEN');
    const apiConfig = new ApiConfig(this.appId, this.secret, this.token);
    ApiConfigKit.putApiConfig(apiConfig);
    // 开启开发模式,方便调试
    ApiConfigKit.devMode = false;
    // 设置当前应用
    ApiConfigKit.setCurrentAppId(apiConfig.getAppId);
  }

  async getAccessToken(): Promise<string> {
    ApiConfigKit.setCurrentAppId(this.appId);
    await AccessTokenApi.refreshAccessToken(ApiConfigKit.getApiConfig);
    const token = await AccessTokenApi.getAccessToken();
    return token.getAccessToken;
  }

  async getTicket(id: number) {
    // 推广码生成
    const code = String(id);
    const accessToken = await this.getAccessToken();
    const url = `${PUBLICURL}qrcode/create?access_token=${accessToken}`;
    const data = {
      expire_seconds: 604800,
      action_name: 'QR_STR_SCENE',
      action_info: { scene: { scene_str: code } },
    };
    const result = await this.httpService.axios.post(url, data);
    // console.log('getTicket: ', result);
    if (!result?.data?.ticket) {
      throw new BadRequestException('A0829');
    } else {
      return { ticket: result?.data?.ticket, url: result?.data?.url };
    }
  }

  async getUnionid(openid: string): Promise<string> {
    // 推广码生成
    const accessToken = await this.getAccessToken();
    const url = `${PUBLICURL}user/info?access_token=${accessToken}&openid=${openid}&lang=zh_CN`;
    const result = await this.httpService.axios.get(url);
    // console.log('getUnionid: ', result);
    if (!result?.data?.unionid) {
      // console.warn('获取不到公众号unionid');
    } else {
      return result?.data?.unionid;
    }
  }

  async sendSubscribeMsg(
    toUser: string,
    templateId: string,
    data: any,
  ): Promise<void> {
    ApiConfigKit.setCurrentAppId(this.appId);
    const accessToken = await AccessTokenApi.refreshAccessToken(
      ApiConfigKit.getApiConfig,
    );
    const page = `pages/Home/index`;
    const miniData = new MiniProgram(
      this.envService.get('WECHAT_MINI_APPID'),
      page,
    );
    let templateJson: string | TemplateData = new TemplateData()
      .New()
      .setToUser(toUser)
      .setTemplateId(templateId)
      .setMiniProgram(miniData);
    for (const [k, v] of Object.entries(data)) {
      templateJson = templateJson.add(k, v as string, '#0000FF');
    }
    templateJson = templateJson.build();
    const result = await this.sendWithRetry(templateJson, accessToken);
    if (result.errcode !== 0) {
      console.warn(result, templateJson);
      throw Error(JSON.stringify(result));
    }
    return;
  }

  private async sendWithRetry(
    tempJson: string,
    accessToken?: AccessToken,
    reTryCount = 3,
  ): Promise<any> {
    let result: any;
    while (reTryCount > 0) {
      result = await TemplateApi.send(tempJson, accessToken);
      if (result.errcode !== '40001') {
        // 不是这个出错误吗退出去即可
        break;
      }
      // 刷新token 重试
      accessToken = await AccessTokenApi.refreshAccessToken(
        ApiConfigKit.getApiConfig,
      );
      --reTryCount;
      console.warn('reTryCount', reTryCount);
    }
    return result;
  }
}
