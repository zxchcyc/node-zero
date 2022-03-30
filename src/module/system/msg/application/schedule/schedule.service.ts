import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { MsgAbstractFacadeService } from '../../facade/msg.facade.abstract';

@Injectable()
export class MsgScheduleService extends BaseService {
  constructor(private readonly facadeService: MsgAbstractFacadeService) {
    super(MsgScheduleService.name);
  }

  // 12月31号0点 清除积分
  // @Cron('00 00 00 31 11 *')
  // @TaskProcess({ lock: true, prefix: 'demo' })
  async demo() {
    this.logger.verbose('Called demo 12月31号0点');
  }
}
