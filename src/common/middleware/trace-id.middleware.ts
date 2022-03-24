/**
 * traceId middleware.
 * https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
 * https://www.zcfy.cc/article/nodejs-logging-made-right
 */
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { createClsNamespace } from '../awesome/context';
const clsNamespace = createClsNamespace();

/**
 * 用于全局挂载 traceId 注入一些基本请求字段
 */
@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(TraceIdMiddleware.name);

  use(request: Request, response: Response, next) {
    clsNamespace.bindEmitter(request);
    clsNamespace.bindEmitter(response);
    // 前端传过来也可以
    const traceId = uuidv4();
    const ua = request.headers['user-agent'];
    const ip = request.headers['x-forwarded-for'] || request.ip;
    let ipv4 = ip as string;
    ipv4 = ipv4.replace('::ffff:', '').split(',')[0];
    clsNamespace.run(() => {
      // 注入追踪
      clsNamespace.set('traceId', traceId);
      // 注入 ip
      clsNamespace.set('ip', ipv4);
      // 注入 ua
      clsNamespace.set('ua', ua);
      // 注入 token
      clsNamespace.set(
        'token',
        request.headers['authorization'] &&
          request.headers['authorization'].replace('Bearer ', ''),
      );
      this.logger.verbose('ipv4:originalUrl', ipv4, request.originalUrl);
      if (request.originalUrl.indexOf('undefined') !== -1) {
        throw new BadRequestException('B0102');
      } else {
        return next();
      }
    });
  }
}
