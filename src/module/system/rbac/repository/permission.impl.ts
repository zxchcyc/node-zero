import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common';
import { Repository } from 'typeorm';
import { PermissionBo, PermissionGroupBo, PgPBo } from '../bo/permission.bo';
import { PermissionGroupEntity } from './permission-gruop.entity';
import { PermissionAbstractRepoService } from './permission.abstract';
import { PermissionEntity } from './permission.entity';
import { PgPEntity } from './pg-p.entity';

@Injectable()
export class PermissionRepoService
  extends BaseService
  implements PermissionAbstractRepoService
{
  constructor(
    @InjectRepository(PermissionGroupEntity)
    private readonly pgRepo: Repository<PermissionGroupEntity>,
    @InjectRepository(PermissionEntity)
    private readonly pRepo: Repository<PermissionEntity>,
    @InjectRepository(PgPEntity)
    private readonly pgpRepo: Repository<PgPEntity>,
  ) {
    super(PermissionRepoService.name);
  }

  async savePermissionGroup(
    data: PermissionGroupBo,
  ): Promise<PermissionGroupBo> {
    await this.pgRepo.upsert(data, ['code']);
    return this.pgRepo.findOne({ code: data.code });
  }

  async savePermission(data: PermissionBo): Promise<PermissionBo> {
    await this.pRepo.upsert(data, ['operationId']);
    return this.pRepo.findOne({ operationId: data.operationId });
  }

  async savePgp(data: PgPBo): Promise<void> {
    await this.pgpRepo.upsert(data, ['pgid', 'pid']);
    return;
  }

  async findPermissionGroup(): Promise<PermissionGroupBo[]> {
    return this.pgRepo.find();
  }

  async findPermission(): Promise<PermissionBo[]> {
    return this.pRepo.find();
  }

  async findPgP(): Promise<PgPBo[]> {
    return this.pgpRepo.find();
  }
}
