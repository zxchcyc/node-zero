import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { TemplateService } from '../../service/template.service';

@Injectable()
export class BullTagService extends BaseService {
  constructor(private readonly templateService: TemplateService) {
    super(BullTagService.name);
  }

  @MQTag(['demo'])
  @MQValidate()
  async demo(data) {
    this.logger.debug(data);
    return;
  }
}
