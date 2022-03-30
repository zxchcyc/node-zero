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

export class MsgBo extends MsgDto {}
export class FindMsgReqBo extends FindMsgReqDto {}
export class FindMsgResBo extends PartialType(FindMsgResDto) {}
export class CreateMsgReqBo extends CreateMsgReqDto {}
export class FindOneMsgResBo extends FindOneMsgResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateMsgReqBo extends UpdateMsgReqDto {}
