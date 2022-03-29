import { Module } from '@nestjs/common';
import { CmsModule } from './business/cms/cms.module';
import { SystemModule } from './system/system.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, SystemModule, CmsModule],
  exports: [CommonModule, SystemModule, CmsModule],
  providers: [],
})
export class ModulesModule {}
