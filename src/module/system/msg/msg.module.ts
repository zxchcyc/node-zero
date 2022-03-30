import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullProcessor } from './application/bullmq/bull.processor';
import { BullTagService } from './application/bullmq/bull-tag.service';
import { MsgWebController } from './application/http/web/v1/msg.controller';
import { MsgScheduleService } from './application/schedule/schedule.service';
import { MsgAbstractFacadeService } from './facade/msg.facade.abstract';
import { MsgFacadeService } from './facade/msg.facade.impl';
import { MsgAbstractRepoService } from './repository/msg.abstract';
import { MsgRepoService } from './repository/msg.cache.impl';
import { MsgEntity } from './repository/msg.entity';
import { MsgService } from './service/msg.service';

@Module({
  imports: [TypeOrmModule.forFeature([MsgEntity])],
  controllers: [MsgWebController],
  providers: [
    {
      provide: MsgAbstractFacadeService,
      useClass: MsgFacadeService,
    },
    {
      provide: MsgAbstractRepoService,
      useClass: MsgRepoService,
    },
    MsgService,
    MsgScheduleService,
    BullTagService,
    BullProcessor,
  ],
  exports: [],
})
export class MsgModule {}
