import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { CmsAbstractFacadeService } from '../../facade/cms.facade.abstract';

@Injectable()
export class CmsScheduleService extends BaseService {
  constructor(private readonly facadeService: CmsAbstractFacadeService) {
    super(CmsScheduleService.name);
  }

  // 12月31号0点 清除积分
  @Cron('00 00 00 31 11 *')
  @TaskProcess({ lock: true, prefix: 'demo' })
  async demo() {
    this.logger.verbose('Called demo 12月31号0点');
    // await this.rocketmqService.publishMessage('test', { a: 1 });
    await this.bullmqService.add(
      {
        queue: 'cms',
        topic: 'cms',
        tag: 'demo',
      },
      {
        a: 1,
      },
    );
  }
}
