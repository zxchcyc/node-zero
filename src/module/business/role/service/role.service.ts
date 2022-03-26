import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
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
import { ERoleStatus } from '../enum/role.enum';
import { RoleAbstractRepoService } from '../repository/role.abstract';

@Injectable()
export class RoleService extends BaseService {
  constructor(private readonly roleRepoService: RoleAbstractRepoService) {
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
    return result;
  }

  async create(data: CreateRoleReqBo): Promise<RoleBo> {
    data.pubAt = new Date();
    const result = await this.roleRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateRoleReqBo): Promise<void> {
    const { status } = data;
    if (status === ERoleStatus.done) {
      data.pubAt = new Date();
    }
    const result = this.roleRepoService.updateById(id, this._.omit(data, []));
    return result;
  }

  async deleteById(id: number): Promise<void> {
    return this.roleRepoService.deleteById(id);
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
      ops.push(
        this.updateById(id, this._.pick(data, ['status', 'isTop', 'sort'])),
      ),
    );
    ops.length && (await Promise.all(ops));
    return;
  }
}
