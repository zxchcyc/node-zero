import { PartialType } from '@nestjs/swagger';
import {
  UserDto,
  FindUserReqDto,
  FindUserResDto,
  CreateUserReqDto,
  FindOneUserResDto,
  UpdateUserReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/user.dto';

export class UserBo extends UserDto {}
export class FindUserReqBo extends FindUserReqDto {}
export class FindUserResBo extends PartialType(FindUserResDto) {}
export class CreateUserReqBo extends CreateUserReqDto {
  regAt?: Date;
}
export class FindOneUserResBo extends FindOneUserResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateUserReqBo extends UpdateUserReqDto {
  account?: string;
  password?: string;
  loginAt?: Date;
}
