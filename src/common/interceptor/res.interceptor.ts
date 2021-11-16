/*
 * @Author: archer zheng
 * @Date: 2021-11-09 14:19:55
 * @LastEditTime: 2021-11-15 23:39:58
 * @LastEditors: archer zheng
 * @Description: 打印请求耗时, 可以加慢请求监控 返回数据格式统一
 * @FilePath: /node-zero/src/common/interceptor/res.interceptor.ts
 */
import {
  Logger,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { tap, map, timeout, catchError } from 'rxjs/operators';
import { EHttpErrorCode, THttpResponse } from '..';
import { getContext } from '../context';

@Injectable()
export class ResTimeInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(ResTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const t1: number = Date.now();
    this.logger.debug('t1', t1);
    this.logger.debug('request', request.query, request.body);

    return next
      .handle()
      .pipe(
        map(async (data): Promise<THttpResponse> => {
          const errorCode = data.errorCode || '00000';
          return {
            errorCode,
            message: EHttpErrorCode[errorCode],
            result: data.result,
            traceId: getContext('traceId'),
          };
        }),
      )
      .pipe(tap(() => this.logger.log(`请求结束: ${Date.now() - t1}ms`)))
      .pipe(
        timeout(5000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(error);
        }),
      );
  }
}
