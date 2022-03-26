import { ELoginTerminal } from 'src/common';
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

export abstract class LoginAbstractFacadeService {
  abstract refreshToken(): Promise<RefreshTokenResBo>;
  abstract logout(): Promise<void>;
  abstract login(
    data: LoginReqBo,
    terminal: ELoginTerminal,
  ): Promise<LoginResBo>;
  abstract getCaptchaByTraceId(data: TraceIdReqBo): Promise<TraceIdResBo>;
  abstract getCaptcha(): Promise<GetCaptchaResBo>;
  abstract validateCaptcha(
    data: ValidateCaptchaReqBo,
  ): Promise<ValidateCaptchaResBo>;
  abstract sendVerifyCode(
    data: SendVerifyCodeReqBo,
  ): Promise<SendVerifyCodeResBo>;
  abstract sendVerifyCodeFirst(
    data: SendVerifyCodeFirstReqBo,
  ): Promise<SendVerifyCodeResBo>;
  abstract forgetPasswd(data: ForgetPasswdReqBo): Promise<ForgetPasswdResBo>;
  abstract loginByPhone(
    data: LoginByPhoneReqBo,
    terminal: ELoginTerminal,
  ): Promise<LoginResBo>;
}
