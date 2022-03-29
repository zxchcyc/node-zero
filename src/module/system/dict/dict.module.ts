import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictWebController } from './application/http/web/v1/dict.controller';
import { DictScheduleService } from './application/schedule/schedule.service';
import { DictAbstractRepoService } from './repository/dict.abstract';
import { DictRepoService } from './repository/dict.cache.impl';
import { DictEntity } from './repository/dict.entity';
import { DictService } from './service/dict.service';

@Module({
  imports: [TypeOrmModule.forFeature([DictEntity])],
  controllers: [DictWebController],
  providers: [
    {
      provide: DictAbstractRepoService,
      useClass: DictRepoService,
    },
    DictService,
    DictScheduleService,
  ],
  exports: [],
})
export class DictModule {}
