import { Module } from '@nestjs/common';
import { CmsModule } from './business/cms/cms.module';
import { DeptModule } from './system/dept/dept.module';
import { RoleModule } from './system/rbac/role.module';
import { UserModule } from './system/user/user.module';
import { SystemModule } from './system/system.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    SystemModule,
    CmsModule,
    UserModule,
    RoleModule,
    DeptModule,
  ],
  exports: [
    CommonModule,
    SystemModule,
    CmsModule,
    UserModule,
    RoleModule,
    DeptModule,
  ],
  providers: [],
})
export class ModulesModule {}
