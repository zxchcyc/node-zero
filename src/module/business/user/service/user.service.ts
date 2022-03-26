import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  FindUserReqBo,
  FindUserResBo,
  FindOneUserResBo,
  CreateUserReqBo,
  UserBo,
  UpdateUserReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/user.bo';
import { EUserType } from '../enum/user.enum';
import { UserAbstractRepoService } from '../repository/user.abstract';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly userRepoService: UserAbstractRepoService) {
    super(UserService.name);
  }

  async count(data: FindUserReqBo): Promise<number> {
    return this.userRepoService.count(data);
  }

  async find(data: FindUserReqBo): Promise<FindUserResBo[]> {
    const result = await this.userRepoService.find(data);
    return result;
  }

  async findById(id: number): Promise<FindOneUserResBo> {
    const result = await this.userRepoService.findById(id);
    return result;
  }

  async create(data: CreateUserReqBo): Promise<UserBo> {
    const result = await this.userRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateUserReqBo): Promise<void> {
    const result = this.userRepoService.updateById(
      id,
      this._.omit(data, ['rids', 'dids']),
    );
    return result;
  }

  async deleteById(id: number): Promise<void> {
    return this.userRepoService.deleteById(id);
  }

  @Transactional()
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) => ops.push(this.deleteById(id)));
    ops.length && (await Promise.all(ops));
    return;
  }

  @Transactional()
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) =>
      ops.push(this.updateById(id, this._.pick(data, ['status']))),
    );
    ops.length && (await Promise.all(ops));
    return;
  }

  async findByPhone(type: EUserType, phone: string) {
    return this.userRepoService.findByPhone(type, phone);
  }

  async findByAccount(type: EUserType, account: string) {
    return this.userRepoService.findByAccount(type, account);
  }
}
