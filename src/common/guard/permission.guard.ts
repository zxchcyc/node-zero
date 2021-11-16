/*
 * @Author: archer zheng
 * @Date: 2020-07-27 11:04:10
 * @LastEditTime: 2021-11-15 13:03:37
 * @LastEditors: archer zheng
 * @Description: 权限守卫
 * @FilePath: /node-zero/src/common/guard/permission.guard.ts
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { setContext } from '..';

@Injectable()
export class PermissionGuard implements CanActivate {
  private logger: Logger = new Logger(PermissionGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 从请求提取权限标识
    let uri = request.route.path;
    uri = uri.replace(/[:]/g, '');
    if (
      request.body.type &&
      request.path.indexOf('/api/web/v1/subjects') !== -1
    ) {
      // uri body 参数解析 一个API 对应多个权限点的情况
      uri = uri + '/' + request.body.type;
    }
    // 请求方法小写 配置时候用小写
    uri = uri + '/' + request.method.toLowerCase();
    this.logger.debug('uri', uri);
    setContext('uri', uri);
    return true;
  }
}
