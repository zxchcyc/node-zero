import { Injectable } from '@nestjs/common';
import { BaseService, ELoginTerminal } from 'src/common';
import { LoginAbstractFacadeService } from './login.facade.abstract';
import {
  ForgetPasswdReqBo,
  ForgetPasswdResBo,
  GetCaptchaResBo,
  LoginByPhoneReqBo,
  LoginReqBo,
  LoginResBo,
  RefreshTokenResBo,
  SendVerifyCodeFirstReqBo,
  SendVerifyCodeReqBo,
  SendVerifyCodeResBo,
  TraceIdReqBo,
  TraceIdResBo,
  ValidateCaptchaReqBo,
  ValidateCaptchaResBo,
} from '../bo/login.bo';
import { LoginService } from '../service/login.service';
import { VerifyCodeService } from '../service/verify-code.service';
import { getContext } from 'src/awesome';

@Injectable()
export class LoginFacadeService
  extends BaseService
  implements LoginAbstractFacadeService
{
  constructor(
    private readonly loginService: LoginService,
    private readonly verifyCodeService: VerifyCodeService,
  ) {
    super(LoginFacadeService.name);
  }

  async refreshToken(): Promise<RefreshTokenResBo> {
    return this.loginService.refreshToken(getContext('user'));
  }

  async logout(): Promise<void> {
    return this.loginService.logout(getContext('user'));
  }

  async login(data: LoginReqBo, terminal: ELoginTerminal): Promise<LoginResBo> {
    return this.loginService.login(data, terminal);
  }

  async loginByPhone(
    data: LoginByPhoneReqBo,
    terminal: ELoginTerminal,
  ): Promise<LoginResBo> {
    return this.loginService.loginByPhone(data, terminal);
  }

  async getCaptchaByTraceId(data: TraceIdReqBo): Promise<TraceIdResBo> {
    return this.verifyCodeService.getCaptchaByTraceId(data);
  }

  async getCaptcha(): Promise<GetCaptchaResBo> {
    return this.verifyCodeService.getCaptcha(getContext('traceId'));
  }

  async validateCaptcha(
    data: ValidateCaptchaReqBo,
  ): Promise<ValidateCaptchaResBo> {
    return this.verifyCodeService.validateCaptcha(data);
  }

  async sendVerifyCode(
    data: SendVerifyCodeReqBo,
  ): Promise<SendVerifyCodeResBo> {
    return this.verifyCodeService.sendVerifyCode(data);
  }

  async sendVerifyCodeFirst(
    data: SendVerifyCodeFirstReqBo,
  ): Promise<SendVerifyCodeResBo> {
    return this.verifyCodeService.sendVerifyCodeFirst(data);
  }

  async forgetPasswd(data: ForgetPasswdReqBo): Promise<ForgetPasswdResBo> {
    return this.verifyCodeService.forgetPasswd(data);
  }
}
