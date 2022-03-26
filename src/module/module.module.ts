import { Module } from '@nestjs/common';
import { CmsModule } from './business/cms/cms.module';
import { RoleModule } from './business/rbac/role.module';
import { UserModule } from './business/user/user.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [SystemModule, CmsModule, UserModule, RoleModule],
  exports: [SystemModule, CmsModule, UserModule, RoleModule],
  providers: [],
})
export class ModulesModule {}
