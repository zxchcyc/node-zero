import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { FindPermissionResBo } from '../bo/permission.bo';
import { PermissionAbstractRepoService } from '../repository/permission.abstract';

@Injectable()
export class PermissionService extends BaseService {
  constructor(
    private readonly permissionRepoService: PermissionAbstractRepoService,
  ) {
    super(PermissionService.name);
  }

  async find(): Promise<FindPermissionResBo[]> {
    const result = await this.permissionRepoService.findPermissionGroup();
    return result;
  }
}
