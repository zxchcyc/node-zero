import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { BaseService } from 'src/common';

@Injectable()
export class DemoService extends BaseService {
  constructor() {
    super(DemoService.name);
  }

  @Timeout(1000)
  // @Cron('00 55 13 05 02 *')
  async handleTimeout() {
    this.logger.verbose('handleTimeout Called once after 1 seconds');
    // await this.rocketmqService.publishMessage('test', { a: 1 });
  }
}
