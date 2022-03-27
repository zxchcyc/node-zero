import { PermissionBo, PermissionGroupBo, PgPBo } from '../bo/permission.bo';

export abstract class PermissionAbstractRepoService {
  abstract findPermissionGroup(): Promise<PermissionGroupBo[]>;
  abstract findPermission(): Promise<PermissionBo[]>;
  abstract findPgP(): Promise<PgPBo[]>;
  abstract savePermissionGroup(
    data: PermissionGroupBo,
  ): Promise<PermissionGroupBo>;
  abstract savePermission(data: PermissionBo): Promise<PermissionBo>;
  abstract savePgp(data: PgPBo): Promise<void>;
}
