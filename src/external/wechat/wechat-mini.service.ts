import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerDebug } from 'src/common';
import { EnvService } from 'src/internal/env/env.service';
import { MiniProgramApi, AccessTokenApi, ApiConfigKit, ApiConfig } from 'tnwx';
import { HttpService } from '../http/http.service';
import { decryptData } from './WXBizDataCrypt';
export type Code2Session = {
  openid: string;
  session_key: string;
  unionid?: string;
  userInfo?: string;
};
const MINIURL = 'https://api.weixin.qq.com/wxa/';

@Injectable()
export class WechatMiniService {
  private appId: string;
  private secret: string;
  constructor(
    private readonly envService: EnvService,
    private readonly httpService: HttpService,
  ) {
    this.appId = this.envService.get('WECHAT_MINI_APPID');
    this.secret = this.envService.get('WECHAT_MINI_SECRET');
    const apiConfig = new ApiConfig(this.appId, this.secret);
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

  async getUnlimited(code: string): Promise<Buffer> {
    const accessToken = await this.getAccessToken();
    const url = `${MINIURL}getwxacodeunlimit?access_token=${accessToken}`;
    const data = {
      scene: code,
      page: 'pages/Home/index',
      env_version: process.env.NODE_ENV === 'prod' ? 'release' : 'trial', //release trial develop
    };
    const result: any = await this.httpService.axios.post(url, data, {
      responseType: 'arraybuffer',
    });
    // console.log('getUnlimited: ', result);
    // data: {
    //   errcode: 40097,
    //   errmsg: 'invalid args rid: 6218da29-3fba01b4-2e966412'
    // }
    if (result?.data?.errcode) {
      throw new BadRequestException('A0829');
    } else {
      return result.data;
    }
  }

  async getPhone(code: string): Promise<string> {
    const accessToken = await this.getAccessToken();
    const url = `${MINIURL}business/getuserphonenumber?access_token=${accessToken}`;
    const data = {
      code,
    };
    const result: any = await this.httpService.axios.post(url, data);
    // console.log('getuserphonenumber: ', result);
    if (result?.data?.errcode !== 0) {
      throw new BadRequestException('A0828');
    } else {
      return result.data.phone_info?.phoneNumber;
    }
  }

  async getPhoneByEncryptedData(
    session_key: string,
    encryptedData: string,
    iv: string,
  ): Promise<string> {
    const result = decryptData(this.appId, session_key, encryptedData, iv);
    return result.phoneNumber;
  }

  async code2Session(code: string): Promise<Code2Session> {
    ApiConfigKit.setCurrentAppId(this.appId);
    const result = await MiniProgramApi.code2Session(
      this.appId,
      this.secret,
      code,
    );
    return {
      openid: result.openid,
      session_key: result.session_key,
      unionid: result.unionid,
    };
  }

  @LoggerDebug()
  async sendSubscribeMsg(
    toUser: string,
    templateId: string,
    data: any,
    page?: string,
  ): Promise<void> {
    ApiConfigKit.setCurrentAppId(this.appId);
    await AccessTokenApi.refreshAccessToken(ApiConfigKit.getApiConfig);
    const result = await this.sendSubscribeMsgWithRetry(
      toUser,
      templateId,
      data,
      page,
    );

    // errcode":40001,"errmsg":"invalid credential, access_token is invalid.."
    // errcode":43101,"errmsg":"user refuse to accept the msg..."
    if (
      result.errcode === 43101 &&
      result.errmsg.indexOf('user refuse to accept the msg') !== -1
    ) {
      console.warn(result);
      return;
    }
    if (result.errcode !== 0) {
      console.warn(result);
      // throw Error('微信小程序模板消息发送失败');
      throw Error(JSON.stringify(result));
    }
    return;
  }

  private async sendSubscribeMsgWithRetry(
    toUser: string,
    templateId: string,
    data: any,
    page?: string,
    reTryCount = 3,
  ): Promise<any> {
    let result: any;
    while (reTryCount > 0) {
      result = await MiniProgramApi.sendSubscribeMsg(
        toUser,
        templateId,
        data,
        page,
      );
      if (result.errcode !== '40001') {
        // 不是这个出错误吗退出去即可
        break;
      }
      // 刷新token 重试
      await AccessTokenApi.refreshAccessToken(ApiConfigKit.getApiConfig);
      --reTryCount;
      console.warn('reTryCount', reTryCount);
    }
    return result;
  }
}
