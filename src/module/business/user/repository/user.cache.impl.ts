import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserAbstractRepoService } from './user.abstract';
import {
  FindUserReqBo,
  FindUserResBo,
  UpdateUserReqBo,
  UserBo,
  UserDeptBo,
  UserRoleBo,
} from '../bo/user.bo';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';
import { EUserType } from '../enum/user.enum';
import { UserRoleEntity } from './user-role.entity';
import { APP_CONFIG } from 'src/common';
import { UserDeptEntity } from './user-dept.entity';

@Injectable()
export class UserRepoService
  extends BaseCacheTyprOrmService<UserEntity>
  implements UserAbstractRepoService
{
  private table: string;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepo: Repository<UserRoleEntity>,
    @InjectRepository(UserDeptEntity)
    private readonly userDeptRepo: Repository<UserDeptEntity>,
  ) {
    super(userRepo, UserRepoService.name);
    this.table = userRepo.metadata.tableName;
  }

  async find(data: FindUserReqBo): Promise<FindUserResBo[]> {
    const result = await super.find(data, null, ['account', 'phone', 'name']);
    return result;
  }

  async findByPhone(type: EUserType, phone: string): Promise<UserBo> {
    if (!phone) return null;
    const key = this.c.indexKeyer(this.table, { type, phone });
    const result = await this.c.queryRowIndex(
      { type, phone },
      key,
      this.userRepo.findOne.bind(this.userRepo),
      this.userRepo.findOne.bind(this.userRepo),
    );
    return result as UserBo;
  }

  async findByAccount(type: EUserType, account: string): Promise<UserBo> {
    if (!account) return null;
    const accountKey = this.c.indexKeyer(this.table, { type, account });
    const result = await this.c.queryRowIndex(
      { type, account },
      accountKey,
      this.userRepo.findOne.bind(this.userRepo),
      this.userRepo.findOne.bind(this.userRepo),
    );
    return result as UserBo;
  }

  async deleteById(id: number): Promise<void> {
    const oldData = await this.findById(id);
    if (!oldData) return;
    await this.userRepo.delete({ id });
    // 主键删除
    const key = this.c.keyer(this.table, id);
    await this.lockService.doubleDel(key);
    const { type, account, phone } = oldData;
    // 唯一键删除
    const accountKey = this.c.indexKeyer(this.table, { type, account });
    const phoneKey = this.c.indexKeyer(this.table, { type, phone });
    await this.lockService.doubleDel(accountKey);
    await this.lockService.doubleDel(phoneKey);
    return;
  }

  async updateById(id: number, data: UpdateUserReqBo): Promise<void> {
    // 如果唯一索引更新了 删除唯一索引到主键的 key 的
    let oldData: UserBo = null;
    if (data.type || data.account || data.phone) {
      oldData = await this.findById(id);
      // 更新手机号的时候同时更新账号
      if (oldData.phone !== data.phone) {
        data.account = data.phone;
      }
    }
    await this.userRepo.update(id, data);
    const key = this.c.keyer(this.table, id);
    await this.lockService.doubleDel(key);
    if (oldData) {
      const { type, account, phone } = oldData;
      const accountKey = this.c.indexKeyer(this.table, { type, account });
      const phoneKey = this.c.indexKeyer(this.table, { type, phone });
      await this.lockService.doubleDel(accountKey);
      await this.lockService.doubleDel(phoneKey);
    }
    if (data.password) {
      const lockKey = `lock:login:accountPasswordError:${id}`;
      await this.lockService.redis.del(lockKey);
    }
    return;
  }

  async updateUserRids(uid: number, rids: number[]): Promise<void> {
    await this.userRoleRepo.delete({ uid });
    await this.lockService.redis.del(`${APP_CONFIG.ROLE_KEY}${uid}`);
    if (rids?.length) {
      await this.userRoleRepo.save(
        rids.map((e) => {
          return { uid, rid: e };
        }),
      );
      await this.lockService.redis.set(
        `${APP_CONFIG.ROLE_KEY}${uid}`,
        JSON.stringify(rids),
      );
    }
    return;
  }

  async findRidByUid(uid: number | number[]): Promise<UserRoleBo[]> {
    uid = Array.isArray(uid) ? uid : [uid];
    const result = await this.userRoleRepo.find({ uid: In(uid) });
    return result;
  }

  async updateUserDids(uid: number, dids: number[]): Promise<void> {
    await this.userDeptRepo.delete({ uid });
    await this.lockService.redis.del(`${APP_CONFIG.DEP_KEY}${uid}`);

    if (dids?.length) {
      await this.userDeptRepo.save(
        dids.map((e) => {
          return { uid, did: e };
        }),
      );
      await this.lockService.redis.set(
        `${APP_CONFIG.DEP_KEY}${uid}`,
        JSON.stringify(dids),
      );
    }
    return;
  }

  async findDidByUid(uid: number | number[]): Promise<UserDeptBo[]> {
    uid = Array.isArray(uid) ? uid : [uid];
    const result = await this.userDeptRepo.find({ uid: In(uid) });
    return result;
  }
}
