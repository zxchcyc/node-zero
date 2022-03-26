import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
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
import { UserService } from '../service/user.service';
import { UserAbstractFacadeService } from './user.facade.abstract';

@Injectable()
export class UserFacadeService
  extends BaseService
  implements UserAbstractFacadeService
{
  constructor(private readonly userService: UserService) {
    super(UserFacadeService.name);
  }
  async count(data: FindUserReqBo): Promise<number> {
    return this.userService.count(data);
  }
  async find(data: FindUserReqBo): Promise<FindUserResBo[]> {
    return this.userService.find(data);
  }
  async create(data: CreateUserReqBo): Promise<UserBo> {
    return this.userService.create(data);
  }
  async findById(id: number): Promise<FindOneUserResBo> {
    return this.userService.findById(id);
  }
  async updateById(id: number, data: UpdateUserReqBo): Promise<void> {
    return this.userService.updateById(id, data);
  }
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    return this.userService.batchDelete(data);
  }
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    return this.userService.batchUpdate(data);
  }
}
