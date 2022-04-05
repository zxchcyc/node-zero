import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { XxljobService } from '../xxl-job.service';

@Injectable()
export class BullTagService extends BaseService {
  constructor(private readonly xxljobService: XxljobService) {
    super(BullTagService.name);
  }

  @MQTag(['demoJobHandler'])
  @MQValidate()
  async demoJobHandler(data) {
    this.logger.debug('===demoJobHandler===', data);
    await this.xxljobService.callback(null, {
      logId: data.logId,
      result: 'success',
    });
    return;
  }
}
