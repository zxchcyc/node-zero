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
    // const result = await this.limitService.periodLimit('test', 10, 60);
    // const result = await this.limitService.tokenLimit(
    //   'test',
    //   'testTime',
    //   10,
    //   60,
    //   this.moment().unix(),
    //   100,
    // );
    // const result = await this.limitService.funnelLimit(
    //   'test',
    //   'testTime',
    //   10,
    //   60,
    //   this.moment().unix(),
    //   1,
    // );
    // this.logger.debug(result);
  }
}
