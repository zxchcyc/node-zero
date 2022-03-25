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

export abstract class UserAbstractFacadeService {
  abstract count(data: FindUserReqBo): Promise<number>;
  abstract getPaging(data: FindUserReqBo): Promise<FindUserResBo[]>;
  abstract create(data: CreateUserReqBo): Promise<UserBo>;
  abstract findById(id: number): Promise<FindOneUserResBo>;
  abstract updateById(id: number, data: UpdateUserReqBo): Promise<void>;
  abstract batchDelete(data: BatchDeleteReqBo): Promise<void>;
  abstract batchUpdate(data: BatchUpdateReqBo): Promise<void>;
}
