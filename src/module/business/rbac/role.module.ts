import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleWebController } from './application/http/web/v1/role.controller';
import { RoleScheduleService } from './application/schedule/schedule.service';
import { RoleAbstractRepoService } from './repository/role.abstract';
import { RoleRepoService } from './repository/role.cache.impl';
import { RoleEntity } from './repository/role.entity';
import { RoleService } from './service/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleWebController],
  providers: [
    {
      provide: RoleAbstractRepoService,
      useClass: RoleRepoService,
    },
    RoleService,
    RoleScheduleService,
  ],
  exports: [],
})
export class RoleModule {}
