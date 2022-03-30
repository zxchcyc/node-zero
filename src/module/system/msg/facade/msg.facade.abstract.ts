import {
  FindMsgReqBo,
  CreateMsgReqBo,
  MsgBo,
  FindOneMsgResBo,
  UpdateMsgReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindMsgResBo,
} from '../bo/msg.bo';

export abstract class MsgAbstractFacadeService {
  abstract count(data: FindMsgReqBo): Promise<number>;
  abstract find(data: FindMsgReqBo): Promise<FindMsgResBo[]>;
  abstract create(data: CreateMsgReqBo): Promise<MsgBo>;
  abstract findById(id: number): Promise<FindOneMsgResBo>;
  abstract updateById(id: number, data: UpdateMsgReqBo): Promise<void>;
  abstract batchDelete(data: BatchDeleteReqBo): Promise<void>;
  abstract batchUpdate(data: BatchUpdateReqBo): Promise<void>;
}
