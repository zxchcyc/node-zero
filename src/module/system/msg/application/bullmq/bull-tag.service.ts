import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { MsgAbstractFacadeService } from '../../facade/msg.facade.abstract';

@Injectable()
export class BullTagService extends BaseService {
  constructor(private readonly facadeService: MsgAbstractFacadeService) {
    super(BullTagService.name);
  }

  @MQTag(['demo'])
  @MQValidate()
  async demo(data) {
    this.logger.debug(data);
    return;
  }
}
