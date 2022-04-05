import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { raw } from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: () => any) {
    raw({ type: '*/*' })(request, response, next);
  }
}
