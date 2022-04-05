import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';

@Injectable()
export class BullTagService extends BaseService {
  constructor() {
    super(BullTagService.name);
  }

  @MQTag(['demoJobHandler'])
  @MQValidate()
  async demoJobHandler(data) {
    this.logger.debug('===demoJobHandler===', data);
    return;
  }
}
