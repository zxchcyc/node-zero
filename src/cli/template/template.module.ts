import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullProcessor } from './application/bullmq/bull.processor';
import { BullTagService } from './application/bullmq/bull-tag.service';
import { TemplateWebController } from './application/http/web/v1/template.controller';
import { TemplateScheduleService } from './application/schedule/schedule.service';
import { TemplateAbstractFacadeService } from './facade/template.facade.abstract';
import { TemplateFacadeService } from './facade/template.facade.impl';
import { TemplateAbstractRepoService } from './repository/template.abstract';
import { TemplateRepoService } from './repository/template.cache.impl';
import { TemplateEntity } from './repository/template.entity';
import { TemplateService } from './service/template.service';
import { RocketTagService } from './application/rocketmq/rocket-tag.service';
import { RocketmqProcessor } from './application/rocketmq/rocketmq.processor';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  controllers: [TemplateWebController],
  providers: [
    {
      provide: TemplateAbstractFacadeService,
      useClass: TemplateFacadeService,
    },
    {
      provide: TemplateAbstractRepoService,
      useClass: TemplateRepoService,
    },
    TemplateService,
    TemplateScheduleService,
    BullTagService,
    BullProcessor,
    RocketTagService,
    RocketmqProcessor,
  ],
  exports: [],
})
export class TemplateModule {}
