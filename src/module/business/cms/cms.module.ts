import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsWebController } from './application/http/web/v1/cms.controller';
import { CmsScheduleService } from './application/schedule/schedule.service';
import { CmsAbstractFacadeService } from './facade/cms.facade.abstract';
import { CmsFacadeService } from './facade/cms.facade.impl';
import { CmsAbstractRepoService } from './repository/cms.abstract';
import { CmsRepoService } from './repository/cms.cache.impl';
import { CmsEntity } from './repository/cms.entity';
import { CmsService } from './service/cms.service';

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
  ],
  exports: [],
})
export class CmsModule {}
