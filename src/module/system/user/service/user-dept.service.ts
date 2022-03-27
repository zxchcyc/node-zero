import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { UserDeptBo } from '../bo/user.bo';
import { UserAbstractRepoService } from '../repository/user.abstract';

@Injectable()
export class UserDeptService extends BaseService {
  constructor(private readonly userRepoService: UserAbstractRepoService) {
    super(UserDeptService.name);
  }

  async findDidByUid(uid: number | number[]): Promise<UserDeptBo[]> {
    return await this.userRepoService.findDidByUid(uid);
  }

  async updateUserDids(uid: number, dids: number[]): Promise<void> {
    return await this.userRepoService.updateUserDids(uid, dids);
  }

  async findUidByDid(did: number | number[]): Promise<UserDeptBo[]> {
    return await this.userRepoService.findUidByDid(did);
  }
}
