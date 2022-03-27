import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { RbacSyncService } from '../../service/rbac-sync.service';

@Injectable()
export class RoleScheduleService extends BaseService {
  constructor(private readonly rbacSyncService: RbacSyncService) {
    super(RoleScheduleService.name);
  }

  // 12月31号0点 清除积分
  // @Cron('00 00 00 31 11 *')
  @Timeout(2000)
  // @TaskProcess({ lock: true, prefix: 'sync' })
  async sync() {
    this.logger.verbose('handleTimeout Called once after 2 seconds');
    await this.rbacSyncService.sync();
  }
}
