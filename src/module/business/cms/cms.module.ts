import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullProcessor } from './application/bullmq/bull.processor';
import { BullTagService } from './application/bullmq/bull-tag.service';
import { CmsWebController } from './application/http/web/v1/cms.controller';
import { CmsScheduleService } from './application/schedule/schedule.service';
import { CmsAbstractFacadeService } from './facade/cms.facade.abstract';
import { CmsFacadeService } from './facade/cms.facade.impl';
import { CmsAbstractRepoService } from './repository/cms.abstract';
import { CmsRepoService } from './repository/cms.cache.impl';
import { CmsEntity } from './repository/cms.entity';
import { CmsService } from './service/cms.service';
import { RocketTagService } from './application/rocketmq/rocket-tag.service';
import { RocketmqProcessor } from './application/rocketmq/rocketmq.processor';

@Module({
  imports: [TypeOrmModule.forFeature([CmsEntity])],
  controllers: [CmsWebController],
  providers: [
    {
      provide: CmsAbstractFacadeService,
      useClass: CmsFacadeService,
    },
    {
      provide: CmsAbstractRepoService,
      useClass: CmsRepoService,
    },
    CmsService,
    CmsScheduleService,
    BullTagService,
    BullProcessor,
    RocketTagService,
    RocketmqProcessor,
  ],
  exports: [],
})
export class CmsModule {}
