import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { RoleAbstractRepoService } from './role.abstract';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';
import { RoleBo, RolePgBo } from '../bo/role.bo';
import { RolePgEntity } from './role-pg.entity';

@Injectable()
export class RoleRepoService
  extends BaseCacheTyprOrmService<RoleEntity>
  implements RoleAbstractRepoService
{
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(RolePgEntity)
    private readonly rolePgRepo: Repository<RolePgEntity>,
  ) {
    super(roleRepo, RoleRepoService.name);
  }

  async saveRole(data: RoleBo): Promise<RoleBo> {
    await this.roleRepo.upsert(data, ['code']);
    return this.roleRepo.findOne({ code: data.code });
  }

  async saveRolePg(data: RolePgBo): Promise<void> {
    await this.rolePgRepo.upsert(data, ['rid', 'pgid']);
    return;
  }

  async findRolePg(): Promise<RolePgBo[]> {
    return this.rolePgRepo.find();
  }

  async findPgidByRid(rid: number | number[]): Promise<RolePgBo[]> {
    rid = Array.isArray(rid) ? rid : [rid];
    const result = await this.rolePgRepo.find({ rid: In(rid) });
    return result;
  }

  async updateRolePgids(rid: number, pgids: number[]): Promise<void> {
    await this.rolePgRepo.delete({ rid });
    if (pgids?.length) {
      await this.rolePgRepo.save(
        pgids.map((e) => {
          return { rid, pgid: e };
        }),
      );
    }
    return;
  }
}
