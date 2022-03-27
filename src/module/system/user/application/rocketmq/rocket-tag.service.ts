import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';

@Injectable()
export class RocketTagService extends BaseService {
  constructor() {
    super(RocketTagService.name);
  }

  @MQTag(['test'])
  @MQValidate()
  async test(data: any) {
    this.logger.debug('===test===', data);
    return;
  }
}
