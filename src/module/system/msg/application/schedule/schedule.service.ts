import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { EMsgTag } from '../../enum/msg.enum';
import { MsgAbstractFacadeService } from '../../facade/msg.facade.abstract';

@Injectable()
export class MsgScheduleService extends BaseService {
  constructor(private readonly facadeService: MsgAbstractFacadeService) {
    super(MsgScheduleService.name);
  }

  // 12月31号0点 清除积分
  // @Cron('00 00 00 31 11 *')
  // @TaskProcess({ lock: true, prefix: 'demo' })
  // @Timeout(2000)
  async publish() {
    this.logger.verbose('handleTimeout Called once after 2 seconds');
    await this.bullmqService.add(
      {
        queue: 'msg',
        topic: 'msg',
        tag: 'publish',
      },
      { uids: [1], tag: EMsgTag.demo, attached: { id: 1, limitCount: 1 } },
      {
        attempts: 3,
      },
    );
  }
}
