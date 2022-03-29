import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { DictService } from '../../service/dict.service';

@Injectable()
export class DictScheduleService extends BaseService {
  constructor(private readonly dictService: DictService) {
    super(DictScheduleService.name);
  }

  // 12月31号0点 清除积分
  @Cron('00 00 00 31 11 *')
  @TaskProcess({ lock: true, prefix: 'demo' })
  async demo() {
    this.logger.verbose('Called demo 12月31号0点');
    // await this.rocketmqService.publishMessage('demo', { a: 1 });
    // await this.bullmqService.add(
    //   {
    //     queue: 'dict',
    //     topic: 'dict',
    //     tag: 'demo',
    //   },
    //   {
    //     a: 1,
    //   },
    // );
  }
}
