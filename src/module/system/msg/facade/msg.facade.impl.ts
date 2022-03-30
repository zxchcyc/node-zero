import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import {
  FindMsgReqBo,
  CreateMsgReqBo,
  MsgBo,
  FindOneMsgResBo,
  UpdateMsgReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindMsgResBo,
  MsgBodyBo,
} from '../bo/msg.bo';
import { MsgDistributeService } from '../service/msg-distribute.service';
import { MsgService } from '../service/msg.service';
import { MsgAbstractFacadeService } from './msg.facade.abstract';

@Injectable()
export class MsgFacadeService
  extends BaseService
  implements MsgAbstractFacadeService
{
  constructor(
    private readonly msgService: MsgService,
    private readonly msgDistributeService: MsgDistributeService,
  ) {
    super(MsgFacadeService.name);
  }
  async count(data: FindMsgReqBo): Promise<number> {
    return this.msgService.count(data);
  }
  async find(data: FindMsgReqBo): Promise<FindMsgResBo[]> {
    return this.msgService.find(data);
  }
  async create(data: CreateMsgReqBo): Promise<MsgBo> {
    return this.msgService.create(data);
  }
  async findById(id: number): Promise<FindOneMsgResBo> {
    return this.msgService.findById(id);
  }
  async updateById(id: number, data: UpdateMsgReqBo): Promise<void> {
    return this.msgService.updateById(id, data);
  }
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    return this.msgService.batchDelete(data);
  }
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    return this.msgService.batchUpdate(data);
  }

  async distribute(data: MsgBo): Promise<void> {
    return this.msgDistributeService.distribute(data);
  }

  async publish(uids: number | number[], data: MsgBodyBo) {
    return this.msgDistributeService.create(uids, data);
  }
}
