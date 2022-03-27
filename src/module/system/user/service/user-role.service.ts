import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { UserRoleBo } from '../bo/user.bo';
import { UserAbstractRepoService } from '../repository/user.abstract';

@Injectable()
export class UserRoleService extends BaseService {
  constructor(private readonly userRepoService: UserAbstractRepoService) {
    super(UserRoleService.name);
  }

  async findRidByUid(uid: number | number[]): Promise<UserRoleBo[]> {
    return await this.userRepoService.findRidByUid(uid);
  }
  async updateUserRids(uid: number, rids: number[]): Promise<void> {
    return await this.userRepoService.updateUserRids(uid, rids);
  }
  async findUidByRid(rid: number | number[]): Promise<UserRoleBo[]> {
    return await this.userRepoService.findUidByRid(rid);
  }
}
