import { Module } from '@nestjs/common';
import { CmsModule } from './business/cms/cms.module';
import { DeptModule } from './system/dept/dept.module';
import { RoleModule } from './system/rbac/role.module';
import { UserModule } from './system/user/user.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [SystemModule, CmsModule, UserModule, RoleModule, DeptModule],
  exports: [SystemModule, CmsModule, UserModule, RoleModule, DeptModule],
  providers: [],
})
export class ModulesModule {}
