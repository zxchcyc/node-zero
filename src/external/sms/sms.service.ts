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
}
