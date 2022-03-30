import {
  FindMsgReqBo,
  FindMsgResBo,
  FindOneMsgResBo,
  CreateMsgReqBo,
  MsgBo,
  UpdateMsgReqBo,
} from '../bo/msg.bo';

export abstract class MsgAbstractRepoService {
  abstract count(data: FindMsgReqBo): Promise<number>;
  abstract find(data: FindMsgReqBo): Promise<FindMsgResBo[]>;
  abstract findById(id: number): Promise<FindOneMsgResBo>;
  abstract create(data: CreateMsgReqBo): Promise<MsgBo>;
  abstract updateById(id: number, data: UpdateMsgReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
  abstract countByMsgid(msgid: string): Promise<number>;
}
