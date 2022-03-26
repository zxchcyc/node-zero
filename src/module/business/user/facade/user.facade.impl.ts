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
import { EUserType } from '../enum/user.enum';
import { UserAggService } from '../service/user-agg.service';
import { UserService } from '../service/user.service';
import { UserAbstractFacadeService } from './user.facade.abstract';

@Injectable()
export class UserFacadeService
  extends BaseService
  implements UserAbstractFacadeService
{
  constructor(
    private readonly userService: UserService,
    private readonly userAggService: UserAggService,
  ) {
    super(UserFacadeService.name);
  }
  async count(data: FindUserReqBo): Promise<number> {
    return this.userService.count(data);
  }
  async find(data: FindUserReqBo): Promise<FindUserResBo[]> {
    return this.userService.find(data);
  }
  async create(data: CreateUserReqBo): Promise<UserBo> {
    return this.userAggService.create(data);
  }
  async findById(id: number): Promise<FindOneUserResBo> {
    return this.userService.findById(id);
  }
  async updateById(id: number, data: UpdateUserReqBo): Promise<void> {
    return this.userAggService.updateById(id, data);
  }
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    return this.userService.batchDelete(data);
  }
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    return this.userService.batchUpdate(data);
  }

  async findByPhone(type: EUserType, phone: string) {
    return this.userService.findByPhone(type, phone);
  }
  async findByAccount(type: EUserType, account: string) {
    return this.userService.findByAccount(type, account);
  }
}
