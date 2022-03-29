import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';

@Injectable()
export class RocketTagService extends BaseService {
  constructor() {
    super(RocketTagService.name);
  }

  @MQTag(['demo'])
  @MQValidate()
  async demo(data: any) {
    this.logger.debug('===demo===', data);
    return;
  }
}
