import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  FindMsgReqBo,
  FindMsgResBo,
  FindOneMsgResBo,
  CreateMsgReqBo,
  MsgBo,
  UpdateMsgReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/msg.bo';
import { MsgAbstractRepoService } from '../repository/msg.abstract';

@Injectable()
export class MsgService extends BaseService {
  constructor(private readonly msgRepoService: MsgAbstractRepoService) {
    super(MsgService.name);
  }

  async count(data: FindMsgReqBo): Promise<number> {
    return this.msgRepoService.count(data);
  }

  async find(data: FindMsgReqBo): Promise<FindMsgResBo[]> {
    const result = await this.msgRepoService.find(data);
    return result;
  }

  async findById(id: number): Promise<FindOneMsgResBo> {
    const result = await this.msgRepoService.findById(id);
    return result;
  }

  async create(data: CreateMsgReqBo): Promise<MsgBo> {
    const result = await this.msgRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateMsgReqBo): Promise<void> {
    const result = await this.msgRepoService.updateById(id, data);
    return result;
  }

  async deleteById(id: number): Promise<void> {
    return await this.msgRepoService.deleteById(id);
  }

  @Transactional()
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) => ops.push(this.deleteById(id)));
    ops.length && (await Promise.all(ops));
    return;
  }

  @Transactional()
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) =>
      ops.push(this.updateById(id, this._.pick(data, ['read']))),
    );
    ops.length && (await Promise.all(ops));
    return;
  }
}
