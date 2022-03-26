import {
  FindUserReqBo,
  CreateUserReqBo,
  UserBo,
  FindOneUserResBo,
  UpdateUserReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindUserResBo,
} from '../bo/user.bo';
import { EUserType } from '../enum/user.enum';

export abstract class UserAbstractFacadeService {
  abstract count(data: FindUserReqBo): Promise<number>;
  abstract find(data: FindUserReqBo): Promise<FindUserResBo[]>;
  abstract create(data: CreateUserReqBo): Promise<UserBo>;
  abstract findById(id: number): Promise<FindOneUserResBo>;
  abstract updateById(id: number, data: UpdateUserReqBo): Promise<void>;
  abstract batchDelete(data: BatchDeleteReqBo): Promise<void>;
  abstract batchUpdate(data: BatchUpdateReqBo): Promise<void>;
  abstract findByPhone(type: EUserType, phone: string): Promise<UserBo>;
  abstract findByAccount(type: EUserType, account: string): Promise<UserBo>;
}
