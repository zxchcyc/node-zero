import {
  ELoginDesc,
  ELoginStatus,
  ELoginTerminal,
  ELoginWay,
  ELoginWebSite,
  ESystem,
} from 'src/common';
import {
  ForgetPasswdReqDto,
  ForgetPasswdResDto,
  GetCaptchaResDto,
  LoginByPhoneReqDto,
  LoginReqDto,
  LoginResDto,
  RefreshTokenResDto,
  RegReqDto,
  SendVerifyCodeFirstReqDto,
  SendVerifyCodeReqDto,
  SendVerifyCodeResDto,
  TraceIdReqDto,
  ValidateCaptchaReqDto,
  ValidateCaptchaResDto,
} from 'src/module/system/login/dto/login.dto';

export class RefreshTokenResBo extends RefreshTokenResDto {}
export class TraceIdReqBo extends TraceIdReqDto {}
export type TraceIdResBo = {
  code: string;
  resType: string;
};
export class LoginReqBo extends LoginReqDto {}
export class LoginResBo extends LoginResDto {}
export class GetCaptchaResBo extends GetCaptchaResDto {}
export class ForgetPasswdReqBo extends ForgetPasswdReqDto {}
export class ForgetPasswdResBo extends ForgetPasswdResDto {}
export class LoginByPhoneReqBo extends LoginByPhoneReqDto {}
export class SendVerifyCodeFirstReqBo extends SendVerifyCodeFirstReqDto {}
export class SendVerifyCodeReqBo extends SendVerifyCodeReqDto {}
export class SendVerifyCodeResBo extends SendVerifyCodeResDto {}
export class ValidateCaptchaReqBo extends ValidateCaptchaReqDto {}
export class ValidateCaptchaResBo extends ValidateCaptchaResDto {}
export class RegReqBo extends RegReqDto {
  name: string;
  account: string;
  regAt: Date;
  terminal: number;
}

export type LoginLogBo = {
  ip: string;
  loginAt: Date;
  uid: number;
  webSite: ELoginWebSite;
  terminal: ELoginTerminal;
  way: ELoginWay;
  status: ELoginStatus;
  desc: ELoginDesc;
  system: ESystem;
};
