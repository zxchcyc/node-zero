import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  Logger,
  HttpException,
} from '@nestjs/common';
import { getContext } from 'src/awesome';
import { EHttpErrorCode } from '..';

/**
 * 捕获全局异常 注意加载顺序 最先加载最后执行
 */
@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(HttpExceptionFilter.name);
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse();

    const res = {
      errorCode: exceptionRes.errorCode,
      message: EHttpErrorCode[exceptionRes.errorCode],
      error: exceptionRes.message,
      stack: exception.stack,
      traceId: getContext('traceId'),
    };
    switch (exception.message) {
      case 'Unauthorized':
        res.errorCode = 'A0005';
        res.message = EHttpErrorCode['A0005'];
        break;
      case 'Request Timeout':
        res.errorCode = 'B0103';
        res.message = EHttpErrorCode['B0103'];
        break;
      case 'ThrottlerException: Too Many Requests':
        res.errorCode = 'A0002';
        res.message = EHttpErrorCode.A0002;
        break;
      default:
        break;
    }
    switch (exceptionRes.error) {
      case 'Not Found':
        res.errorCode = 'B0102';
        res.message = EHttpErrorCode['B0102'];
        break;
      case 'Forbidden':
        res.errorCode = 'A0005';
        res.message = EHttpErrorCode['A0005'];
        break;
      case 'Bad Request':
        res.errorCode = res.error;
        res.message = EHttpErrorCode[res.error];
        break;
      default:
        break;
    }

    if (res.errorCode !== 'B0102') {
      this.logger.error(
        res,
        `Catch ${exception.name}! Request path: ${
          request.url
        } Body: ${JSON.stringify(request.body)} Query: ${JSON.stringify(
          request.query,
        )} Params: ${JSON.stringify(request.params)}`,
      );
    }

    response.status(status).json(res);
  }
}
