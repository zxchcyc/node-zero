import { Inject, Logger } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import { LockService } from 'src/internal/lock/lock.service';

/**
 * Controller 基础类
 */
export abstract class BaseController {
  @Inject()
  protected readonly lockService: LockService;
  @Inject()
  protected readonly envService: EnvService;
  protected logger: Logger;
  constructor(controllerName: string) {
    this.logger = new Logger(controllerName);
  }
}
