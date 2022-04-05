import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { EnvService } from 'src/internal/env/env.service';

@Injectable()
export class XxljobMiddleware implements NestMiddleware {
  constructor(private readonly envService: EnvService) {}

  use(request: Request, response: Response, next: () => any) {
    const token = request.headers['xxl-job-access-token'];
    if (
      !!this.envService.get('XXL_JOB_ACCESSTOKEN') &&
      this.envService.get('XXL_JOB_ACCESSTOKEN') !== token
    ) {
      response.send({ code: 500, msg: 'access token incorrect' });
      return;
    }
    return next();
  }
}
