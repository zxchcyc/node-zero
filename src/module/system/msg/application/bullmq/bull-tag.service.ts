import { Injectable } from '@nestjs/common';
import { BaseService, MQValidate } from 'src/common';
import { MQTag } from 'src/common';
import { MsgDto, PublishMsgReqDto } from '../../dto/msg.dto';
import { MsgAbstractFacadeService } from '../../facade/msg.facade.abstract';

@Injectable()
export class BullTagService extends BaseService {
  constructor(private readonly facadeService: MsgAbstractFacadeService) {
    super(BullTagService.name);
  }

  @MQTag(['distribute'])
  @MQValidate()
  async distribute(data: MsgDto) {
    await this.facadeService.distribute(data);
    return;
  }

  @MQTag(['publish'])
  @MQValidate()
  async publish(data: PublishMsgReqDto) {
    await this.facadeService.publish(
      data.uid || data.uids,
      this._.omit(data, ['uids', 'uid']),
    );
    return;
  }
}
