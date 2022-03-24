import { Inject, Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';
import { getContext } from 'src/common';
import { WebhookService } from 'src/external/webhook/webhook.service';
import { format } from 'util';
import { EnvService } from '../env/env.service';

@Injectable()
export class LoggerService extends ConsoleLogger {
  @Inject()
  protected readonly webhookService: WebhookService;
  constructor(private readonly envService: EnvService) {
    super();
    this.envService.get('MYSQL_SYNCHRONIZE');
    // const levels: LogLevel[] = ['log', 'debug', 'error', 'verbose', 'warn'];
    const levels = this.envService.get('LOG_LEVEL').split(',');
    super.setLogLevels(levels as LogLevel[]);
  }
  error(...args: any) {
    const context = args.pop();
    super.error(format(args), `${context} ${getContext('traceId')}`);
    let webhook = false;
    // 有错误码的情况下 只发送指定错误码
    if (
      !args[0]?.errorCode ||
      [
        'A0002',
        'A0003',
        'B0001',
        'B0100',
        'B0101',
        'B0103',
        'C0001',
        'C0002',
      ].includes(args[0]?.errorCode)
    ) {
      webhook = true;
    }
    if (webhook && args[0]?.message) {
      this.webhookService.send(
        JSON.stringify(args[0]?.message) + ' ' + JSON.stringify(args[0]?.error),
        JSON.stringify(args[0]?.stack),
      );
    }
  }
  log(...args: any) {
    const context = args.pop();
    super.log(format(args), `${context} ${getContext('traceId')}`);
  }
  warn(...args: any) {
    const context = args.pop();
    super.warn(format(args), `${context} ${getContext('traceId')}`);
  }
  verbose(...args: any) {
    const context = args.pop();
    super.verbose(format(args), `${context} ${getContext('traceId')}`);
  }
  debug(...args: any) {
    const context = args.pop();
    super.debug(format(args), `${context} ${getContext('traceId')}`);
  }
}
