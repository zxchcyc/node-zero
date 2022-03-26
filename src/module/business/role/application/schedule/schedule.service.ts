import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { RoleService } from '../../service/role.service';

@Injectable()
export class RoleScheduleService extends BaseService {
  constructor(private readonly roleService: RoleService) {
    super(RoleScheduleService.name);
  }

  // 12月31号0点 清除积分
  @Cron('00 00 00 31 11 *')
  @TaskProcess({ lock: true, prefix: 'demo' })
  async demo() {
    this.logger.verbose('Called demo 12月31号0点');
    // await this.rocketmqService.publishMessage('test', { a: 1 });
    await this.bullmqService.add(
      {
        queue: 'role',
        topic: 'role',
        tag: 'demo',
      },
      {
        a: 1,
      },
    );
  }
}
