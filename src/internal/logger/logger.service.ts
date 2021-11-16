import { Inject, Injectable, ConsoleLogger } from '@nestjs/common';
import { getContext } from 'src/common';
import { WebhookService } from 'src/external/webhook/webhook.service';
import { format } from 'util';

@Injectable()
export class LoggerService extends ConsoleLogger {
  @Inject()
  protected readonly webhookService: WebhookService;
  constructor() {
    super();
  }
  error(...args: any) {
    const context = args.pop();
    super.error(format(args), `${context} ${getContext('traceId')}`);
    this.webhookService.send(
      JSON.stringify(args[0]?.message),
      JSON.stringify(args[0]?.stack),
    );
  }
  log(...args: any) {
    const context = args.pop();
    super.log(format(args), `${context} ${getContext('traceId')}`);
  }
  warn(...args: any) {
    const context = args.pop();
    super.warn(format(args), `${context} ${getContext('traceId')}`);
  }
  debug(...args: any) {
    const context = args.pop();
    super.debug(format(args), `${context} ${getContext('traceId')}`);
  }
}
