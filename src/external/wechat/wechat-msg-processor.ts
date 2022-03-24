import { Injectable } from '@nestjs/common';
import { LoggerDebug } from 'src/common';
import {
  InAuthEvent,
  InAuthMpEvent,
  InBatchJobResult,
  InBatchJobResultEvent,
  InComponentVerifyTicket,
  InEnterAgentEvent,
  InExternalContact,
  InExternalContactEvent,
  InFollowEvent,
  InImageMsg,
  InLinkMsg,
  InLocationEvent,
  InLocationMsg,
  InMassEvent,
  InMenuEvent,
  InMsg,
  InNotDefinedMsg,
  InQrCodeEvent,
  InRegisterCorp,
  InShakearoundUserShakeEvent,
  InShortVideoMsg,
  InSpeechRecognitionResults,
  InSuiteTicket,
  InTaskEvent,
  InTemplateMsgEvent,
  InTextMsg,
  InUpdatePartyEvent,
  InUpdateTagEvent,
  InUpdateUserEvent,
  InVideoMsg,
  InVoiceMsg,
  InWxVerifyDispatchEvent,
  MsgAdapter,
  OutTextMsg,
} from 'tnwx';
import { WechatMsgService } from './wechat-msg.service';

@Injectable()
export class WechatMsgProcessor implements MsgAdapter {
  constructor(private readonly wechatMsgService: WechatMsgService) {}
  processInTextMsg(inTextMsg: InTextMsg): any {
    return 'success';
  }
  processInImageMsg(inImageMsg: InImageMsg): any {
    return 'success';
  }
  processInVoiceMsg(inVoiceMsg: InVoiceMsg): any {
    return 'success';
  }
  processInVideoMsg(inVideoMsg: InVideoMsg): any {
    return 'success';
  }
  processInShortVideoMsg(inShortVideoMsg: InShortVideoMsg): any {
    return 'success';
  }
  processInLocationMsg(inLocationMsg: InLocationMsg): any {
    return 'success';
  }
  processInLinkMsg(inLinkMsg: InLinkMsg): any {
    return 'success';
  }
  processInSpeechRecognitionResults(
    inSpeechRecognitionResults: InSpeechRecognitionResults,
  ): any {
    return 'success';
  }
  processIsNotDefinedMsg(inNotDefinedMsg: InNotDefinedMsg): any {
    return 'success';
  }

  async processInFollowEvent(inFollowEvent: InFollowEvent): Promise<any> {
    if (inFollowEvent.getEvent === 'subscribe') {
      return this.wechatMsgService.deal(
        inFollowEvent.getFromUserName,
        inFollowEvent.getEventKey,
      );
    }
    return 'success';
  }

  async processInQrCodeEvent(inQrCodeEvent: InQrCodeEvent): Promise<any> {
    return await this.wechatMsgService.deal(
      inQrCodeEvent.getFromUserName,
      inQrCodeEvent.getEventKey,
    );
  }
  processInLocationEvent(inLocationEvent: InLocationEvent): any {
    return 'success';
  }
  processInMenuEvent(inMenuEvent: InMenuEvent): any {
    return 'success';
  }
  processInWxVerifyDispatchEvent(
    inWxVerifyDispatchEvent: InWxVerifyDispatchEvent,
  ): any {
    return 'success';
  }
  processInTemplateMsgEvent(inTemplateMsgEvent: InTemplateMsgEvent): any {
    return 'success';
  }
  processInShakearoundUserShakeEvent(
    inShakearoundUserShakeEvent: InShakearoundUserShakeEvent,
  ): any {
    return 'success';
  }
  processInTaskEvent(inTaskEvent: InTaskEvent): any {
    return 'success';
  }
  processInEnterAgentEvent(inEnterAgentEvent: InEnterAgentEvent): any {
    return 'success';
  }
  processInBatchJobResultEvent(
    inBatchJobResultEvent: InBatchJobResultEvent,
  ): any {
    return 'success';
  }
  processInUpdateUserEvent(inUpdateUserEvent: InUpdateUserEvent): any {
    return 'success';
  }
  processInUpdatePartyEvent(inUpdatePartyEvent: InUpdatePartyEvent): any {
    return 'success';
  }
  processInUpdateTagEvent(inUpdateTagEvent: InUpdateTagEvent): any {
    return 'success';
  }
  processInMassEvent(inMassEvent: InMassEvent): any {
    return 'success';
  }
  processInSuiteTicket(inSuiteTicket: InSuiteTicket): any {
    return 'success';
  }
  processInComponentVerifyTicket(
    inComponentVerifyTicket: InComponentVerifyTicket,
  ): any {
    return 'success';
  }
  processInAuthEvent(inAuthEvent: InAuthEvent): any {
    return 'success';
  }
  processInAuthMpEvent(inAuthMpEvent: InAuthMpEvent): any {
    return 'success';
  }
  processInBatchJobResult(inBatchJobResult: InBatchJobResult): any {
    return 'success';
  }
  processInExternalContactEvent(
    inExternalContactEvent: InExternalContactEvent,
  ): any {
    return 'success';
  }
  processInExternalContact(inExternalContact: InExternalContact): any {
    return 'success';
  }
  processInRegisterCorp(inRegisterCorp: InRegisterCorp): any {
    return 'success';
  }
  renderOutTextMsg(inMsg: InMsg, content?: string): any {
    const outMsg = new OutTextMsg(inMsg);
    outMsg.setContent(content ? content : 'success');
    return outMsg;
  }
}
