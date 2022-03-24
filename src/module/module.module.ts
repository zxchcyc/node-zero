import { Module } from '@nestjs/common';
import { CmsModule } from './business/cms/cms.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [SystemModule, CmsModule],
  exports: [SystemModule, CmsModule],
  providers: [],
})
export class ModulesModule {}
