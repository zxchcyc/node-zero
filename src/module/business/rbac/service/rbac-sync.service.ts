import { Injectable } from '@nestjs/common';
import { APP_CONFIG, BaseService } from 'src/common';
import { PermissionBo, PermissionGroupBo, PgPBo } from '../bo/permission.bo';
import { RoleBo } from '../bo/role.bo';
import { PermissionAbstractRepoService } from '../repository/permission.abstract';
import { RoleAbstractRepoService } from '../repository/role.abstract';

@Injectable()
export class RbacSyncService extends BaseService {
  constructor(
    private readonly roleRepoService: RoleAbstractRepoService,
    private readonly permissionRepoService: PermissionAbstractRepoService,
  ) {
    super(RbacSyncService.name);
  }

  async syncPermission(
    permissionGroupList: PermissionGroupBo[],
    permissionList: PermissionBo[],
  ) {
    for (const e of permissionGroupList) {
      const ret = await this.permissionRepoService.savePermissionGroup(e);
      e.id = ret.id;
    }

    for (const e of permissionList) {
      const ret = await this.permissionRepoService.savePermission(e);
      e.id = ret.id;
    }

    const permissionListGroup = this._.groupBy(
      permissionList,
      'permissionGroupName',
    );
    const pglistObj = this._.keyBy(permissionGroupList, 'name');
    const pgpOps = [];
    const ppglist = [];
    for (const [k, v] of Object.entries(permissionListGroup)) {
      v.forEach((e) => ppglist.push({ pgid: pglistObj[k].id, pid: e.id }));
    }
    ppglist.forEach((e) => pgpOps.push(this.permissionRepoService.savePgp(e)));
    pgpOps.length && (await Promise.all(pgpOps));
    return;
  }

  async syncRole(rolelist: RoleBo[], pglist: PermissionGroupBo[]) {
    const pglistObj = this._.keyBy(pglist, 'code');
    const rgpOps = [];
    const rpglist = [];
    for (const e of rolelist) {
      const ret = await this.roleRepoService.saveRole(e);
      e.id = ret.id;
      for (const p of e['pgList']) {
        rpglist.push({ rid: e.id, pgid: pglistObj[p].id });
      }
    }
    rpglist.forEach((e) => rgpOps.push(this.roleRepoService.saveRolePg(e)));
    rgpOps.length && (await Promise.all(rgpOps));
    return;
  }

  async syncCache(plist: PermissionBo[], pgplist: PgPBo[]): Promise<void> {
    const rolelist = await this.roleRepoService.findRolePg();
    const rolelistGroup = this._.groupBy(rolelist, 'pgid');
    const pgplistGroup = this._.groupBy(pgplist, 'pid');

    const data = new Map<string, Set<number>>();
    for (const p of plist) {
      const ridSet = new Set<number>();
      // 获取权限对应的权限包
      const pgids = pgplistGroup[p.id].map((e) => e.pgid);
      for (const pgid of pgids) {
        // 获取权限包对应的角色
        const rids = rolelistGroup[pgid].map((e) => e.rid);
        rids.forEach((rid) => ridSet.add(rid));
      }
      data.set(p.operationId, ridSet);
    }
    const ops = [];
    await this.lockService.redis.del(APP_CONFIG.PERMISSION_KEY);
    for (const [k, v] of Object.entries(Object.fromEntries(data))) {
      ops.push(
        this.lockService.redis.hset(
          APP_CONFIG.PERMISSION_KEY,
          k,
          JSON.stringify([...v]),
        ),
      );
    }
    ops.length && (await Promise.all(ops));
  }
}
