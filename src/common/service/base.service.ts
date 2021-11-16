import { Logger, Inject } from '@nestjs/common';
import { LockService } from 'src/internal/lock/lock.service';
import { AbstractMqService } from 'src/external/mq/adapter/mq.service.abstract';
import { EnvService } from 'src/internal/env/env.service';
import * as _ from 'lodash';

/**
 * 抽象基础服务
 *
 */
export abstract class BaseService {
  @Inject()
  protected readonly mqService: AbstractMqService;
  @Inject()
  protected readonly lockService: LockService;
  @Inject()
  protected readonly envService: EnvService;
  protected logger: Logger;
  protected _: _.LoDashStatic;

  protected constructor(serviceName: string) {
    this._ = _;
    this.logger = new Logger(serviceName);
  }
}
