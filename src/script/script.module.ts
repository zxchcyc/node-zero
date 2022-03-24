import { Global, Module } from '@nestjs/common';
import { DemoModule } from './demo/demo.module';

@Global()
@Module({
  controllers: [],
  providers: [],
  imports: [DemoModule],
  exports: [DemoModule],
})
export class ScriptModule {}
