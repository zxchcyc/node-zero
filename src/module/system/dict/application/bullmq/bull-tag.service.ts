import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { DictService } from '../../service/dict.service';

@Injectable()
export class BullTagService extends BaseService {
  constructor(private readonly dictService: DictService) {
    super(BullTagService.name);
  }

  @MQTag(['demo'])
  @MQValidate()
  async demo(data) {
    this.logger.debug(data);
    return;
  }
}
