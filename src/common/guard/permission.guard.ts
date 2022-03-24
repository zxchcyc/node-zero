/*
 * @Author: archer zheng
 * @Date: 2020-07-27 11:04:10
 * @LastEditTime: 2022-03-24 20:58:10
 * @LastEditors: archer zheng
 * @Description: 权限守卫
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { getContext, setContext } from 'src/awesome';
import { BaseService } from '..';

@Injectable()
export class PermissionGuard extends BaseService implements CanActivate {
  constructor() {
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
    return true;
  }
}
