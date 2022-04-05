/*
 * @Author: archer zheng
 * @Date: 2021-11-09 14:19:55
 * @LastEditTime: 2022-04-05 18:19:57
 * @LastEditors: archer zheng
 * @Description: 打印请求耗时, 可以加慢请求监控 返回数据格式统一
 */
import {
  Logger,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { tap, map, timeout, catchError } from 'rxjs/operators';
import { EHttpErrorCode } from '..';
import { getContext } from '../../awesome/context';

@Injectable()
export class ResTimeInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(ResTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const t1: number = Date.now();
    return next
      .handle()
      .pipe(
        map(async (data) => {
          if (['wechat', 'xxljob'].includes(data?.result?.resType)) {
            response.status(HttpStatus.OK).send(data.result.data);
          } else if (data?.result?.resType === 'svg') {
            response.type('image/svg+xml');
            response.send(data.result.code);
          } else if (data?.result?.resType === 'pdf') {
            response.type('application/pdf');
            response.send(data.result.code);
          } else {
            const errorCode = data.errorCode || '00000';
            return {
              errorCode,
              message: EHttpErrorCode[errorCode],
              result: data.result,
              traceId: getContext('traceId'),
            };
          }
        }),
      )
      .pipe(tap(() => this.logger.debug(`请求结束: ${Date.now() - t1}ms`)))
      .pipe(
        timeout(120000),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(error);
        }),
      );
  }
}
