import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { RegionSyncService } from '../../service/region-sync.service';

@Injectable()
export class RegionScheduleService extends BaseService {
  constructor(private readonly regionSyncService: RegionSyncService) {
    super(RegionScheduleService.name);
  }

  // 12月31号0点 清除积分
  // @Timeout(2000)
  // @TaskProcess({ lock: true, prefix: 'sync-region' })
  async syncRegion() {
    this.logger.verbose('handleTimeout Called once after 2 seconds');
    await this.regionSyncService.sync();
  }
}
