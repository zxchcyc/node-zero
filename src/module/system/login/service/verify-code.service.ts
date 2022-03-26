import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService, EStatus, EVerifyCodeType } from 'src/common';
import {
  ForgetPasswdReqBo,
  ForgetPasswdResBo,
  GetCaptchaResBo,
  SendVerifyCodeFirstReqBo,
  SendVerifyCodeReqBo,
  SendVerifyCodeResBo,
  TraceIdReqBo,
  ValidateCaptchaReqBo,
  ValidateCaptchaResBo,
} from '../bo/login.bo';
import * as svgCaptcha from 'svg-captcha';
import { SmsService } from 'src/external/sms/sms.service';
import { genPassword } from './password';
import {
  captchaKey,
  validateCaptchaKey,
  verifyCodeLimitKey,
  verifyCodeUseKey,
} from './key';
import { getContext } from 'src/awesome';
import { UserAbstractFacadeService } from 'src/module/business/user/facade/user.facade.abstract';

@Injectable()
export class VerifyCodeService extends BaseService {
  constructor(
    private readonly smsService: SmsService,
    private readonly userFacadeService: UserAbstractFacadeService,
  ) {
    super(VerifyCodeService.name);
  }

  async getCaptchaByTraceId(data: TraceIdReqBo) {
    const { traceId } = data;
    const svg = svgCaptcha.create();
    if (svg) {
      // 把验证码存到 redis 过期时间 60s
      await this.lockService.redis.set(
        captchaKey(traceId),
        svg.text.toUpperCase(),
        'EX',
        60,
      );
      return {
        code: svg.data,
        resType: 'svg',
      };
    } else {
      throw new BadRequestException('A0807');
    }
  }

  async getCaptcha(traceId: string): Promise<GetCaptchaResBo> {
    const svg = svgCaptcha.create();
    // 这里没使用
    if (svg) {
      return {
        code: `${this.envService.get(
          'DA_API_HOST',
        )}/api/web/v1/user/get-captcha/${traceId}`,
        traceId,
      };
    } else {
      throw new BadRequestException('A0807');
    }
  }

  async validateCaptcha(
    data: ValidateCaptchaReqBo,
  ): Promise<ValidateCaptchaResBo> {
    const { type, code, traceId, phone } = data;
    const text = await this.lockService.redis.get(captchaKey(traceId));
    if (code.toUpperCase() === text) {
      const newTraceId = getContext('traceId');
      await this.lockService.redis.set(
        validateCaptchaKey(`${type}:${phone}`),
        newTraceId,
        'EX',
        60,
      );
      return {
        verifyCodeId: newTraceId,
      };
    } else {
      throw new BadRequestException('A0808');
    }
  }

  async sendVerifyCode(
    data: SendVerifyCodeReqBo,
  ): Promise<SendVerifyCodeResBo> {
    const { type, phone, verifyCodeId } = data;
    // 验证图像验证码是否正确
    const cacheVerifyCodeId = await this.lockService.redis.get(
      validateCaptchaKey(`${type}:${phone}`),
    );
    if (cacheVerifyCodeId !== verifyCodeId) {
      throw new BadRequestException('A0809');
    }
    const key = verifyCodeLimitKey(`${type}:${phone}`);
    return this.sendSingle(data, key);
  }

  async sendVerifyCodeFirst(
    data: SendVerifyCodeFirstReqBo,
  ): Promise<SendVerifyCodeResBo> {
    const { type, phone } = data;
    const key = verifyCodeLimitKey(`${type}:${phone}`);
    const ttl = await this.lockService.redis.ttl(key);
    // 1 h 内是否发送过
    if (ttl > 60 * 60 * 23) {
      throw new BadRequestException('A0819');
    }
    return this.sendSingle(data, key);
  }

  private async sendSingle(
    data: SendVerifyCodeReqBo | SendVerifyCodeFirstReqBo,
    key: string,
  ): Promise<SendVerifyCodeResBo> {
    const { type, phone, verifyCodeType } = data;
    // 手机号是否存在;
    if (
      [EVerifyCodeType.forgetPassword, EVerifyCodeType.login].includes(
        verifyCodeType,
      )
    ) {
      const user = await this.userFacadeService.findByPhone(type, phone);
      if (!user) {
        throw new BadRequestException('A0803');
      }
      if (user.status !== EStatus.enable) {
        throw new BadRequestException('A0800');
      }
    }
    // 发送次数限制 接口级别限制
    // 一天只能发十次
    const count = await this.lockService.redis.get(key);
    if (Number(count) >= Number(this.envService.get('VEFIRY_CODE_LIMIT'))) {
      throw new BadRequestException('A0811');
    }
    // 生成随机验证码
    const code = Math.ceil(Math.random() * 9000 + 1000).toString();
    // 把验证码存到 redis 过期时间 60*10s
    await this.lockService.redis.set(
      verifyCodeUseKey(`${type}:${phone}:${verifyCodeType}`),
      code.toUpperCase(),
      'EX',
      60 * 10,
    );
    const send = await this.smsService.sendSingle(code, phone);
    if (send) {
      await this.lockService.redis.incr(key);
      if (Number(count) === 0) {
        // 第一次发送给incr key设置过期时间（一天）
        await this.lockService.redis.expire(key, 60 * 60 * 24);
      }
    }
    return { send };
  }

  async forgetPasswd(data: ForgetPasswdReqBo): Promise<ForgetPasswdResBo> {
    const { type, phone, password, code } = data;
    // 手机号是否存在;
    const user = await this.userFacadeService.findByPhone(type, phone);
    if (!user) {
      throw new BadRequestException('A0803');
    }
    const cacheCode = await this.lockService.redis.get(
      verifyCodeUseKey(`${type}:${phone}:${EVerifyCodeType.forgetPassword}`),
    );
    if (!cacheCode) {
      throw new BadRequestException('A0820');
    }
    if (cacheCode === code) {
      const { hash } = await genPassword(password);
      await this.userFacadeService.updateById(user.id, { password: hash });
      return { done: true };
    } else {
      throw new BadRequestException('A0806');
    }
  }
}
