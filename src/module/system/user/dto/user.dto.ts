import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EStatus } from 'src/common';
import { ReqPaginatorDto } from 'src/common/dto';
import { EUserType } from '../enum/user.enum';

export class UserDto {
  @ApiProperty({ description: '数据库ID', type: Number })
  @IsNotEmpty()
  @Type(() => Number)
  id: number;

  @IsString()
  @ApiProperty({ description: '名称' })
  name: string;

  @IsString()
  @ApiProperty({ description: '账号' })
  account: string;

  @IsString()
  @ApiProperty({ description: '密码' })
  password: string;

  @IsMobilePhone()
  @IsOptional()
  @ApiProperty({ description: '电话' })
  phone: string;

  @IsString()
  @ApiProperty({ description: '注册时间', format: 'date-time' })
  regAt: Date;

  @IsString()
  @ApiProperty({ description: '最后登录时间', format: 'date-time' })
  loginAt: Date;

  @ApiProperty({ description: '状态 1 启动 2 禁用', enum: EStatus })
  @IsEnum(EStatus)
  @Type(() => Number)
  @IsOptional()
  status?: EStatus;

  @ApiProperty({
    description: '用户类型 1 管理员 2 经销商/终端用户',
    enum: EUserType,
  })
  @IsEnum(EUserType)
  @Type(() => Number)
  @IsOptional()
  type?: EUserType;
}

export class FindUserReqDto extends IntersectionType(
  ReqPaginatorDto,
  PickType(PartialType(UserDto), ['type', 'status'] as const),
) {
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform((v) => {
    if (typeof v.value === 'string') {
      return JSON.parse(v.value);
    } else {
      return v.value;
    }
  })
  @IsOptional()
  ids?: number[];

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '模糊查询字段：phone/account/name' })
  keyword?: string;
}

export class FindUserResDto extends UserDto {}

export class RoleDeptDto {
  @IsArray()
  @ApiProperty({ description: '账号角色ID', type: [Number] })
  @IsNumber({}, { each: true })
  @IsOptional()
  rids?: number[];

  @IsArray()
  @ApiProperty({ description: '账号部门ID', type: [Number] })
  @IsNumber({}, { each: true })
  @IsOptional()
  dids?: number[];
}

export class CreateUserReqDto extends IntersectionType(
  RoleDeptDto,
  PickType(UserDto, [
    'name',
    'phone',
    'account',
    'password',
    'status',
    'type',
  ] as const),
) {}

export class FindOneUserResDto extends IntersectionType(
  RoleDeptDto,
  PickType(UserDto, [
    'name',
    'phone',
    'account',
    'password',
    'status',
    'type',
  ] as const),
) {}

export class UpdateUserReqDto extends IntersectionType(
  RoleDeptDto,
  PickType(PartialType(UserDto), ['name', 'phone', 'status', 'type'] as const),
) {}

export class BatchUpdateReqDto extends PickType(PartialType(UserDto), [
  'status',
] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}

export class BatchDeleteReqDto extends PickType(UserDto, [] as const) {
  @IsArray()
  @ApiProperty({ description: 'ID数组', type: [Number] })
  @IsNumber({}, { each: true })
  ids: number[];
}
