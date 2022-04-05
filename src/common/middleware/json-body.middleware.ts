import { Request, Response } from 'express';
import { json } from 'body-parser';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: () => any) {
    json({ limit: '1000kb' })(request, response, next);
  }
}
