import {
  FindUserReqBo,
  FindUserResBo,
  FindOneUserResBo,
  CreateUserReqBo,
  UserBo,
  UpdateUserReqBo,
} from '../bo/user.bo';

export abstract class UserAbstractRepoService {
  abstract count(data: FindUserReqBo): Promise<number>;
  abstract find(data: FindUserReqBo): Promise<FindUserResBo[]>;
  abstract findById(id: number): Promise<FindOneUserResBo>;
  abstract create(data: CreateUserReqBo): Promise<UserBo>;
  abstract updateById(id: number, data: UpdateUserReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
}
