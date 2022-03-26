import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { RoleAbstractRepoService } from './role.abstract';
import { FindRoleReqBo, FindRoleResBo } from '../bo/role.bo';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class RoleRepoService
  extends BaseCacheTyprOrmService<RoleEntity>
  implements RoleAbstractRepoService
{
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {
    super(roleRepo, RoleRepoService.name);
  }

  async find(data: FindRoleReqBo): Promise<FindRoleResBo[]> {
    const orderBy = { isTop: 'DESC', sort: 'ASC', id: 'DESC' };
    const result = await super.find(data, orderBy as OrderByCondition);
    return result;
  }
}
