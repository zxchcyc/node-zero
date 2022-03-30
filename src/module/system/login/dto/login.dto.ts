import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { EVerifyCodeType } from 'src/common';
import { UserDto } from 'src/module/system/user/dto/user.dto';

export class RefreshTokenResDto {
  @IsString()
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;

  @IsString()
  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;

  @IsString()
  @ApiProperty({ description: 'accessTokenExpiresIn' })
  accessTokenExpiresIn: string;
}

export class LoginDto extends PickType(UserDto, ['id'] as const) {}

export class LoginReqDto extends PickType(UserDto, [
  'type',
  'account',
  'password',
] as const) {}

export class LoginResDto extends LoginDto {
  @IsString()
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;

  @IsString()
  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;

  @IsString()
  @ApiProperty({ description: 'accessTokenExpiresIn' })
  accessTokenExpiresIn: string;
}

export class TraceIdReqDto {
  @ApiProperty({ description: '追踪ID', type: String })
  @IsString()
  traceId: string;
}

export class GetCaptchaResDto {
  @IsString()
  @ApiProperty({ description: '图形验证码' })
  code: string;

  @IsString()
  @ApiProperty({ description: '唯一id' })
  traceId: string;
}

export class ValidateCaptchaReqDto extends PickType(UserDto, [
  'phone',
  'type',
] as const) {
  @IsString()
  @ApiProperty({ description: '图形验证码' })
  code: string;

  @IsString()
  @ApiProperty({ description: '唯一id' })
  traceId: string;
}

export class ValidateCaptchaResDto {
  @IsString()
  @ApiProperty({ description: '手机验证码ID' })
  verifyCodeId: string;
}

export class SendVerifyCodeResDto extends PickType(UserDto, [] as const) {
  @IsBoolean()
  @ApiProperty({ description: '是否发送成功' })
  send: boolean;
}

export class SendVerifyCodeReqDto extends PickType(UserDto, [
  'phone',
  'type',
] as const) {
  @ApiProperty({
    description: '1 登录 2 找回密码 3 申请试用 4 注册 5 更改手机号 ',
    enum: EVerifyCodeType,
  })
  @IsEnum(EVerifyCodeType)
  @IsNumber()
  @Type(() => Number)
  readonly verifyCodeType: EVerifyCodeType;

  @IsString()
  @ApiProperty({ description: '获取手机验证码ID' })
  verifyCodeId: string;
}

export class SendVerifyCodeFirstReqDto extends PickType(UserDto, [
  'phone',
  'type',
] as const) {
  @ApiProperty({
    description: '1 登录 2 找回密码 3 申请试用 4 注册 5 更改手机号 ',
    enum: EVerifyCodeType,
  })
  @IsEnum(EVerifyCodeType)
  @IsNumber()
  @Type(() => Number)
  readonly verifyCodeType: EVerifyCodeType;
}

export class ForgetPasswdReqDto extends PickType(UserDto, [
  'type',
  'phone',
  'password',
] as const) {
  @IsString()
  @ApiProperty({ description: '验证码' })
  code: string;
}

export class ForgetPasswdResDto extends PickType(UserDto, [] as const) {
  @IsBoolean()
  @ApiProperty({ description: '是否修改成功' })
  done: boolean;
}

export class LoginByPhoneReqDto extends PickType(UserDto, [
  'phone',
  'type',
] as const) {
  @IsString()
  @ApiProperty({ description: '验证码' })
  code: string;
}

export class RegReqDto extends PickType(UserDto, [
  'type',
  'phone',
  'password',
] as const) {
  @IsString()
  @ApiProperty({ description: '验证码' })
  code: string;
}
