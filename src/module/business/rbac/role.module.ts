import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleWebController } from './application/http/web/v1/role.controller';
import { RoleScheduleService } from './application/schedule/schedule.service';
import { PermissionGroupEntity } from './repository/permission-gruop.entity';
import { PermissionAbstractRepoService } from './repository/permission.abstract';
import { PermissionEntity } from './repository/permission.entity';
import { PermissionRepoService } from './repository/permission.impl';
import { PgPEntity } from './repository/pg-p.entity';
import { RolePgEntity } from './repository/role-pg.entity';
import { RoleAbstractRepoService } from './repository/role.abstract';
import { RoleRepoService } from './repository/role.cache.impl';
import { RoleEntity } from './repository/role.entity';
import { RbacSyncService } from './service/rbac-sync.service';
import { RoleService } from './service/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionGroupEntity,
      PermissionEntity,
      PgPEntity,
      RolePgEntity,
    ]),
  ],
  controllers: [RoleWebController],
  providers: [
    {
      provide: PermissionAbstractRepoService,
      useClass: PermissionRepoService,
    },
    {
      provide: RoleAbstractRepoService,
      useClass: RoleRepoService,
    },
    RoleScheduleService,
    RoleService,
    RbacSyncService,
  ],
  exports: [],
})
export class RoleModule {}
