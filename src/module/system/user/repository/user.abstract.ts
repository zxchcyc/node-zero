import {
  FindUserReqBo,
  FindUserResBo,
  FindOneUserResBo,
  CreateUserReqBo,
  UserBo,
  UpdateUserReqBo,
  UserRoleBo,
  UserDeptBo,
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
  abstract findRidByUid(uid: number | number[]): Promise<UserRoleBo[]>;
  abstract updateUserRids(uid: number, rids: number[]): Promise<void>;
  abstract findDidByUid(uid: number | number[]): Promise<UserDeptBo[]>;
  abstract updateUserDids(uid: number, dids: number[]): Promise<void>;
  abstract findUidByDid(did: number | number[]): Promise<UserDeptBo[]>;
  abstract findUidByRid(rid: number | number[]): Promise<UserRoleBo[]>;
}
