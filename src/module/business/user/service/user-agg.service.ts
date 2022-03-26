import { BadRequestException, Injectable } from '@nestjs/common';
import { getContext } from 'src/awesome';
import { BaseService } from 'src/common';
import { genPassword } from 'src/module/system/login/service/password';
import {
  CreateUserReqBo,
  FindOneUserResBo,
  UpdateUserReqBo,
  UserBo,
} from '../bo/user.bo';
import { UserRoleService } from './user-role.service';
import { UserService } from './user.service';

@Injectable()
export class UserAggService extends BaseService {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) {
    super(UserAggService.name);
  }

  async create(data: CreateUserReqBo): Promise<UserBo> {
    const { type, account, phone, password, rids } = data;
    const { hash } = await genPassword(password);
    data.password = hash;
    data.regAt = new Date();
    const accountExist = await this.userService.findByAccount(type, account);
    if (accountExist) {
      throw new BadRequestException('A0801');
    }
    const phoneExist = await this.userService.findByPhone(type, phone);
    if (phoneExist) {
      throw new BadRequestException('A0804');
    }
    const result = await this.userService.create(data);
    if (rids?.length) {
      await this.userRoleService.updateUserRids(result.id, rids);
    }
    return result;
  }

  async updateById(id: number, data: UpdateUserReqBo): Promise<void> {
    const { type, phone, account, password, rids } = data;
    if (password) {
      // 生成密码
      const { hash } = await genPassword(data.password);
      data.password = hash;
    }
    if (account) {
      const accountExist = await this.userService.findByAccount(type, account);
      if (accountExist && accountExist.id !== id) {
        throw new BadRequestException('A0801');
      }
    }
    if (phone) {
      const phoneExist = await this.userService.findByPhone(type, phone);
      if (phoneExist && phoneExist.id !== id) {
        throw new BadRequestException('A0804');
      }
    }
    await this.userService.updateById(id, this._.omit(data, ['rids']));

    if (rids?.length) {
      await this.userRoleService.updateUserRids(id, rids);
    }
    return;
  }

  async findById(id?: number): Promise<FindOneUserResBo> {
    const uid = id || getContext('user')?.id;
    const result = await this.userService.findById(uid);
    // 获取角色
    const userRids = await this.userRoleService.findRidByUid(uid);
    result.rids = userRids.map((e) => e.rid);
    return result;
  }
}
