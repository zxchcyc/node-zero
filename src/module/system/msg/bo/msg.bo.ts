import { PartialType } from '@nestjs/swagger';
import {
  MsgDto,
  FindMsgReqDto,
  FindMsgResDto,
  CreateMsgReqDto,
  FindOneMsgResDto,
  UpdateMsgReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/msg.dto';
import { EMsgTag } from '../enum/msg.enum';

export class MsgBo extends MsgDto {}
export class FindMsgReqBo extends FindMsgReqDto {}
export class FindMsgResBo extends PartialType(FindMsgResDto) {}
export class CreateMsgReqBo extends CreateMsgReqDto {}
export class FindOneMsgResBo extends FindOneMsgResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateMsgReqBo extends UpdateMsgReqDto {}

type attached = { id?: string | number; limitCount?: number };
export type MsgBodyBo = {
  tag: EMsgTag;
  title?: string;
  content?: string;
  // 消息落地需要的参数放这里面 {id:'attachedId'} 根据场景自行生成，后面会生成消息id做幂等用
  attached?: Record<string, any> & attached;
};
