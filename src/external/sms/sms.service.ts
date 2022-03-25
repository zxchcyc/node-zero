import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import { HttpService } from '../http/http.service';

/**
 * sms 服务类
 */
@Injectable()
export class SmsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {}

  async sendSingle(code: string, phone: string): Promise<boolean> {
    const data = {
      text: `【${this.envService.get(
        'SMS_SIGN_NAME',
      )}】您的验证码是${code}，十分钟内有效。`,
      mobile: phone,
    };
    const result = await this.httpService.smsRequest(
      'POST',
      '/v2/sms/single_send.json',
      data,
    );

    if (result['code'] === 0) {
      return true;
    } else {
      return false;
    }
  }

  async sendDealer(code: string, phone: string): Promise<boolean> {
    const data = {
      text: `【${this.envService.get(
        'SMS_SIGN_NAME',
      )}】尊敬的客户，您的系统账号已创建，登录账号为手机号，初始密码：${code}。请及时登录系统修改密码并进行实名认证。网址：da-admin.alu120.com`,
      mobile: phone,
    };
    const result = await this.httpService.smsRequest(
      'POST',
      '/v2/sms/single_send.json',
      data,
    );
    if (result['code'] === 0) {
      return true;
    } else {
      return false;
    }
  }
}
