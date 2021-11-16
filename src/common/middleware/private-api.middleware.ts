import { Request, Response } from 'express';
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';

/**
 * 用于内部接口 白名单限制 最好在运维层面支持
 */
@Injectable()
export class PrivateApiMiddleware implements NestMiddleware {
  private logger: Logger = new Logger(PrivateApiMiddleware.name);

  constructor(private readonly envService: EnvService) {}
  use(request: Request, response: Response, next) {
    privateApiMiddlewareFunction(this.envService)(request, response, next);
  }
}

export function privateApiMiddlewareFunction(envService: EnvService) {
  return (request: Request, response: Response, next) => {
    const ip = request.headers['x-forwarded-for'] || request.ip;
    let ipv4 = ip as string;
    ipv4 = ipv4.replace('::ffff:', '').split(',')[0];
    if (envService.get('PRIVATE_API_WHITELIST')?.split(',').includes(ipv4)) {
      return next();
    } else {
      throw new BadRequestException(
        `请联系管理员添加白名单 IP: ${ipv4}`,
        'A0003',
      );
    }
  };
}
