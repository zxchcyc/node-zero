import { Injectable } from '@nestjs/common';
import { APP_CONFIG, BaseService, EStatus } from 'src/common';
import { PermissionBo, PermissionGroupBo } from '../bo/permission.bo';
import { RoleBo } from '../bo/role.bo';
import { PERMISSION_GROUP_LIST } from '../constant/permission-group';
import { ROLE_LIST } from '../constant/role';
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
    const pglistObj = this._.keyBy(pglist, 'name');
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

  /**
   * @description: ?????????????????????????????????
   * @author: archer zheng
   */
  async syncCache(): Promise<void> {
    // ??????
    const plist = await this.permissionRepoService.findPermission();
    if (!plist.length) {
      this.logger.warn('??????????????????');
      await this.lockService.redis.del(APP_CONFIG.PERMISSION_KEY);
      return;
    }
    // ??????????????????
    const pgplist = await this.permissionRepoService.findPgP();
    if (!pgplist.length) {
      this.logger.warn('??????????????????????????????');
      await this.lockService.redis.del(APP_CONFIG.PERMISSION_KEY);
      return;
    }
    // ?????????????????????????????????????????????
    const enableRoles = await this.roleRepoService.find({
      status: EStatus.enable,
    });
    if (!enableRoles.length) {
      this.logger.warn('?????????????????????????????????????????????????????????');
      await this.lockService.redis.del(APP_CONFIG.PERMISSION_KEY);
      return;
    }
    const rolePglist = await this.roleRepoService.findRolePg(
      enableRoles.map((e) => e.id),
    );
    const rolelistGroup = this._.groupBy(rolePglist, 'pgid');
    const pgplistGroup = this._.groupBy(pgplist, 'pid');

    const data = new Map<string, Set<number>>();
    for (const p of plist) {
      const ridSet = new Set<number>();
      // ??????????????????????????????
      const pgids = pgplistGroup[p.id].map((e) => e.pgid);
      for (const pgid of pgids) {
        // ??????????????????????????????
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

  /**
   * @description: ?????? ROLE_LIST ????????????,??????????????????,?????????????????????????????????
   * @author: archer zheng
   */
  async sync() {
    await this.syncPermission(
      PERMISSION_GROUP_LIST as PermissionGroupBo[],
      this.getPermissionList() as PermissionBo[],
    );
    const pglist = await this.permissionRepoService.findPermissionGroup();
    await this.syncRole(ROLE_LIST as RoleBo[], pglist);
    await this.syncCache();
    this.logger.debug('????????????????????????????????????');
  }

  /**
   * @description: ????????????
   * @ApiExtension('x-permission', {
      moduleName: '???????????????',
      groupName: ['????????????'],
    })
   * @author: archer zheng
   */
  getPermissionList() {
    const paths = this.envService.get('openapiPaths');
    const permissionListFromDecorator = Object.keys(paths)
      .map((key) =>
        Object.keys(paths[key])
          .filter((k) => paths[key][k]['x-permission'])
          .map((k) =>
            Object({
              operationId: `${key.split(/{|}/).join('')}/${k}`,
              name: `${paths[key][k]['x-permission'].moduleName}:${paths[key][k].summary}`,
              permissionGroupName: paths[key][k]['x-permission'].groupName,
            }),
          ),
      )
      .flat(2);

    return [...permissionListFromDecorator];
  }
}
