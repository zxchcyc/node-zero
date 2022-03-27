import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UserAbstractFacadeService } from '../../user/facade/user.facade.abstract';
import {
  FindRoleReqBo,
  FindRoleResBo,
  FindOneRoleResBo,
  CreateRoleReqBo,
  RoleBo,
  UpdateRoleReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/role.bo';
import { RoleAbstractRepoService } from '../repository/role.abstract';
import { RbacSyncService } from './rbac-sync.service';

@Injectable()
export class RoleService extends BaseService {
  constructor(
    private readonly roleRepoService: RoleAbstractRepoService,
    private readonly userFacadeService: UserAbstractFacadeService,
    private readonly rbacSyncService: RbacSyncService,
  ) {
    super(RoleService.name);
  }

  async count(data: FindRoleReqBo): Promise<number> {
    return this.roleRepoService.count(data);
  }

  async find(data: FindRoleReqBo): Promise<FindRoleResBo[]> {
    const result = await this.roleRepoService.find(data);
    return result;
  }

  async findById(id: number): Promise<FindOneRoleResBo> {
    const result = await this.roleRepoService.findById(id);
    // 获取角色管理权限包
    const rolePgids = await this.roleRepoService.findPgidByRid(id);
    result.pgids = rolePgids.map((e) => e.pgid);
    return result;
  }

  async create(data: CreateRoleReqBo): Promise<RoleBo> {
    const { pgids } = data;
    const result = await this.roleRepoService.create(data);
    // 设置角色管理权限包
    if (pgids?.length) {
      await this.roleRepoService.updateRolePgids(result.id, pgids);
    }
    return result;
  }

  async updateById(id: number, data: UpdateRoleReqBo): Promise<void> {
    const { pgids } = data;
    const result = await this.roleRepoService.updateById(id, data);
    // 设置角色管理权限包
    if (pgids?.length) {
      await this.roleRepoService.updateRolePgids(id, pgids);
    }
    // 更新状态的后置条件 1、同步一下缓存
    if (data.status) {
      await this.rbacSyncService.syncCache();
    }
    return result;
  }

  async deleteById(id: number): Promise<void> {
    // 删除的前提条件 1、没有用户关联
    const users = await this.userFacadeService.findUidByRid(id);
    if (users?.length) {
      throw new BadRequestException('A1002');
    }
    // 删除的后置条件 1、用户角色处理 2、删除权限包关联关系 1、同步一下缓存
    await this.roleRepoService.updateRolePgids(id, []);
    await this.rbacSyncService.syncCache();
    return await this.roleRepoService.deleteById(id);
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
}
