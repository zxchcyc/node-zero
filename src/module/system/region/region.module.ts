import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionWebController } from './application/http/web/v1/region.controller';
import { RegionScheduleService } from './application/schedule/schedule.service';
import { RegionAbstractRepoService } from './repository/region.abstract';
import { RegionRepoService } from './repository/region.cache.impl';
import { RegionEntity } from './repository/region.entity';
import { RegionSyncService } from './service/region-sync.service';
import { RegionService } from './service/region.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  controllers: [RegionWebController],
  providers: [
    {
      provide: RegionAbstractRepoService,
      useClass: RegionRepoService,
    },
    RegionService,
    RegionSyncService,
    RegionScheduleService,
  ],
  exports: [],
})
export class RegionModule {}
