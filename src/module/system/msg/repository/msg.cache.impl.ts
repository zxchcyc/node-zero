import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MsgEntity } from './msg.entity';
import { MsgAbstractRepoService } from './msg.abstract';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class MsgRepoService
  extends BaseCacheTyprOrmService<MsgEntity>
  implements MsgAbstractRepoService
{
  constructor(
    @InjectRepository(MsgEntity)
    private readonly msgRepo: Repository<MsgEntity>,
  ) {
    super(msgRepo, MsgRepoService.name);
  }

  async countByMsgid(msgid: string): Promise<number> {
    return await this.msgRepo.count({ msgid });
  }
}
