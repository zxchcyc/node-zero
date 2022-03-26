import {
  FindUserReqBo,
  FindUserResBo,
  FindOneUserResBo,
  CreateUserReqBo,
  UserBo,
  UpdateUserReqBo,
} from '../bo/user.bo';
import { EUserType } from '../enum/user.enum';

export abstract class UserAbstractRepoService {
  abstract count(data: FindUserReqBo): Promise<number>;
  abstract find(data: FindUserReqBo): Promise<FindUserResBo[]>;
  abstract findById(id: number): Promise<FindOneUserResBo>;
  abstract create(data: CreateUserReqBo): Promise<UserBo>;
  abstract updateById(id: number, data: UpdateUserReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
  abstract findByPhone(type: EUserType, phone: string): Promise<UserBo>;
  abstract findByAccount(type: EUserType, account: string): Promise<UserBo>;
}
