import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  Logger,
} from '@nestjs/common';
import { getContext } from 'src/awesome';
import { EHttpErrorCode } from '..';

/**
 * 捕获全局异常 注意加载顺序 最先加载最后执行
 */
@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(AllExceptionFilter.name);
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    this.logger.error(`未知错误! Request path: ${request.url}`, exception);
    const resJson = {
      errorCode: 'B0001',
      message: EHttpErrorCode['B0001'],
      error: exception.message,
      stack: exception.stack,
      traceId: getContext('traceId'),
    };
    response.status(500).json(resJson);
  }
}
