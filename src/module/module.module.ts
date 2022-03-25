import { Module } from '@nestjs/common';
import { CmsModule } from './business/cms/cms.module';
import { UserModule } from './business/user/user.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [SystemModule, CmsModule, UserModule],
  exports: [SystemModule, CmsModule, UserModule],
  providers: [],
})
export class ModulesModule {}
