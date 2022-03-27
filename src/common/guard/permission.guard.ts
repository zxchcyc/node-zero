/*
 * @Author: archer zheng
 * @Date: 2020-07-27 11:04:10
 * @LastEditTime: 2022-03-27 15:57:39
 * @LastEditors: archer zheng
 * @Description: 功能权限守卫
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { getContext, setContext } from 'src/awesome';
import { UserAbstractFacadeService } from 'src/module/system/user/facade/user.facade.abstract';
import { APP_CONFIG, BaseService, EStatus } from '..';

@Injectable()
export class PermissionGuard extends BaseService implements CanActivate {
  constructor(private readonly userFacadeService: UserAbstractFacadeService) {
    super(PermissionGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 从请求提取权限标识
    let uri = request.route.path;
    uri = uri.replace(/[:]/g, '');
    // 请求方法小写 配置时候用小写
    uri = uri + '/' + request.method.toLowerCase();
    // this.logger.debug('uri', uri);
    setContext('uri', uri);
    const user = getContext('user');
    // this.logger.debug('user', user);

    if (!user) {
      throw new BadRequestException('A0005');
    }
    // 用户状态
    const { status } = await this.userFacadeService.findById(user.id);
    if (status === EStatus.disable) {
      throw new BadRequestException('A0800');
    }

    // uri 对应的 rids
    const uriRids = JSON.parse(
      await this.lockService.redis.hget(APP_CONFIG.PERMISSION_KEY, uri),
    );
    // 用户对应的 rids
    const userRoleKey = `${APP_CONFIG.ROLE_KEY}${user.id}`;
    const userRids = await this.takeWithCache(
      userRoleKey,
      this.userFacadeService.findRidByUid.bind(this.userFacadeService),
      user.id,
      'rid',
    );
    let pass = false;
    userRids?.forEach((rid: number) => {
      if (uriRids?.includes[rid]) {
        pass = true;
      }
    });
    if (pass) {
      return pass;
    } else {
      throw new BadRequestException('A0008');
    }
  }
}
