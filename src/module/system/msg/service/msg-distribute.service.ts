import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { CreateMsgReqBo, MsgBo, MsgBodyBo } from '../bo/msg.bo';
import { MsgAbstractRepoService } from '../repository/msg.abstract';
import { genMsgId } from './gen-msgid';

@Injectable()
export class MsgDistributeService extends BaseService {
  constructor(private readonly msgRepoService: MsgAbstractRepoService) {
    super(MsgDistributeService.name);
  }

  /**
   * @description: 消息根据不同的tag分发到不同的渠道
   * @param {MsgBo} data
   * @return {*}
   * @author: archer zheng
   */
  async distribute(data: MsgBo): Promise<void> {
    this.logger.debug(data);
    return;
  }

  /**
   * @description: 消息创建(有幂等场景的需要注意消息id生成)
   * @param {number} uids
   * @param {MsgBodyBo} data
   * @return {*}
   * @author: archer zheng
   */
  async create(uids: number | number[], data: MsgBodyBo): Promise<void> {
    uids = (Array.isArray(uids) ? uids : [uids]) as number[];
    for (const uid of uids) {
      const msgid = genMsgId(uid, data.tag, data.attached?.id);
      const limitCount = data.attached?.limitCount;
      const msg = <CreateMsgReqBo>{
        uid,
        tag: data.tag,
        title: data.title,
        content: data.content,
        attached: JSON.stringify(data.attached),
        msgid,
      };
      if (limitCount) {
        // 走幂等限制
        const existCount = await this.msgRepoService.countByMsgid(msgid);
        if (existCount >= limitCount) {
          this.logger.debug(msgid, existCount, '已经发送过');
          return;
        }
      }
      const ret = await this.msgRepoService.create(msg);
      this.logger.debug('===create msg===', ret);
      await this.bullmqService.add(
        {
          queue: 'msg',
          topic: 'msg',
          tag: 'distribute',
        },
        ret,
        {
          attempts: 3,
        },
      );
    }
    return;
  }
}
