import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { UserAbstractFacadeService } from '../../facade/user.facade.abstract';

@Injectable()
export class UserScheduleService extends BaseService {
  constructor(private readonly facadeService: UserAbstractFacadeService) {
    super(UserScheduleService.name);
  }

  // 12月31号0点 清除积分
  // @Cron('00 00 00 31 11 *')
  // @TaskProcess({ lock: true, prefix: 'demo' })
  async demo() {
    this.logger.verbose('Called demo 12月31号0点');
  }
}
