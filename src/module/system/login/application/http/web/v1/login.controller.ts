import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController, ApiCommResponse, ELoginTerminal } from 'src/common';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';
import { LoginAbstractFacadeService } from 'src/module/system/login/facade/login.facade.abstract';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  ForgetPasswdReqDto,
  ForgetPasswdResDto,
  GetCaptchaResDto,
  LoginByPhoneReqDto,
  LoginReqDto,
  LoginResDto,
  RefreshTokenResDto,
  SendVerifyCodeFirstReqDto,
  SendVerifyCodeReqDto,
  SendVerifyCodeResDto,
  TraceIdReqDto,
  ValidateCaptchaReqDto,
  ValidateCaptchaResDto,
} from 'src/module/system/login/dto/login.dto';

@ApiTags('WebV1Login')
@Controller('web/v1')
export class WebLoginController extends BaseController {
  constructor(private readonly facadeService: LoginAbstractFacadeService) {
    super(WebLoginController.name);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(1, 60)
  @Post('user/refresh/token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '刷新 accessToken' })
  @ApiCommResponse('obj', RefreshTokenResDto)
  @ApiExtraModels(RefreshTokenResDto)
  async refreshToken() {
    const result = await this.facadeService.refreshToken();
    return { result };
  }

  @Post('user/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '退出登录' })
  @ApiCommResponse()
  async logout() {
    await this.facadeService.logout();
    return { result: null };
  }

  @Post('user/login')
  @ApiOperation({ summary: '密码登录' })
  @ApiCommResponse('obj', LoginResDto)
  @ApiExtraModels(LoginResDto)
  async login(@Body() data: LoginReqDto) {
    const result = await this.facadeService.login(data, ELoginTerminal.web);
    return { result };
  }

  @Post('user/login-by-phone')
  @ApiOperation({ summary: '手机验证码登录' })
  @ApiCommResponse('obj', LoginResDto)
  @ApiExtraModels(LoginResDto)
  async loginByPhone(@Body() data: LoginByPhoneReqDto) {
    const result = await this.facadeService.loginByPhone(
      data,
      ELoginTerminal.web,
    );
    return { result };
  }

  @Get('user/get-captcha/:traceId')
  @ApiOperation({ summary: '获取图形验证码(不用手动调用)' })
  async getCaptchaByTraceId(@Param() data: TraceIdReqDto) {
    const result = await this.facadeService.getCaptchaByTraceId(data);
    return { result };
  }

  @Get('user/get-captcha')
  @ApiOperation({ summary: '获取图形验证码' })
  @ApiCommResponse('obj', GetCaptchaResDto)
  @ApiExtraModels(GetCaptchaResDto)
  async getCaptcha() {
    const result = await this.facadeService.getCaptcha();
    return { result };
  }

  @Post('user/validate-captcha')
  @ApiOperation({ summary: '验证图形验证码' })
  @ApiCommResponse('obj', ValidateCaptchaResDto)
  @ApiExtraModels(ValidateCaptchaResDto)
  async validateCaptcha(@Body() data: ValidateCaptchaReqDto) {
    const result = await this.facadeService.validateCaptcha(data);
    return { result };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(1, 60)
  @Post('user/send-verify-code')
  @ApiOperation({ summary: '获取手机验证码(触发图形验证码后使用)' })
  @ApiCommResponse('obj', SendVerifyCodeResDto)
  @ApiExtraModels(SendVerifyCodeResDto)
  async sendVerifyCode(@Body() data: SendVerifyCodeReqDto) {
    const result = await this.facadeService.sendVerifyCode(data);
    return { result };
  }

  @UseGuards(ThrottlerGuard)
  @Throttle(1, 60)
  @Post('user/send-verify-code-first')
  @ApiOperation({ summary: '获取手机验证码(第一次调用使用)' })
  @ApiCommResponse('obj', SendVerifyCodeResDto)
  @ApiExtraModels(SendVerifyCodeResDto)
  async sendVerifyCodeFirst(@Body() data: SendVerifyCodeFirstReqDto) {
    const result = await this.facadeService.sendVerifyCodeFirst(data);
    return { result };
  }

  @Post('user/forget-password')
  @ApiOperation({ summary: '忘记密码' })
  @ApiCommResponse('obj', ForgetPasswdResDto)
  @ApiExtraModels(ForgetPasswdResDto)
  async forgetPasswd(@Body() data: ForgetPasswdReqDto) {
    const result = await this.facadeService.forgetPasswd(data);
    return { result };
  }
}
