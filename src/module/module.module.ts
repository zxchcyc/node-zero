import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';

@Module({
  imports: [SystemModule],
  exports: [SystemModule],
  providers: [],
})
export class ModulesModule {}
