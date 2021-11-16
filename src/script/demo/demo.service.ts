import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';

@Injectable()
export class DemoService extends BaseService {
  constructor() {
    super(DemoService.name);
  }

  @Timeout(1000)
  @TaskProcess({ lock: true })
  async handleTimeout() {
    this.logger.debug('Called once after 1 seconds');
  }
}
