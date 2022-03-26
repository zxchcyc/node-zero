import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { genPassword } from 'src/module/system/login/service/password';
import { CreateUserReqBo, UpdateUserReqBo, UserBo } from '../bo/user.bo';
import { UserService } from './user.service';

@Injectable()
export class UserAggService extends BaseService {
  constructor(private readonly userService: UserService) {
    super(UserAggService.name);
  }

  async create(data: CreateUserReqBo): Promise<UserBo> {
    const { password } = data;
    const { type, account, phone } = data;
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
    return result;
  }

  async updateById(id: number, data: UpdateUserReqBo): Promise<void> {
    const { type, phone } = data;
    if (phone) {
      const phoneExist = await this.userService.findByPhone(type, phone);
      if (phoneExist && phoneExist.id !== id) {
        throw new BadRequestException('A0804');
      }
    }
    return await this.userService.updateById(id, data);
  }

  async updatePasswordById(id: number, password: string): Promise<void> {
    return await this.userService.updateById(id, { password });
  }
}
