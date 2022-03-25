import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { TemplateAbstractFacadeService } from '../../facade/template.facade.abstract';

@Injectable()
export class BullTagService extends BaseService {
  constructor(private readonly facadeService: TemplateAbstractFacadeService) {
    super(BullTagService.name);
  }

  @MQTag(['demo'])
  @MQValidate()
  async demo(data) {
    this.logger.debug(data);
    return;
  }
}
