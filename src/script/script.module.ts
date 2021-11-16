import { Global, Module } from '@nestjs/common';
import { DemoModule } from './demo/demo.module';

const providers = [];
if (['1', 'true', 'TRUE'].includes(process.env.TASK_ENABLED)) {
  providers.push();
}
@Global()
@Module({
  controllers: [],
  providers,
  imports: [DemoModule],
  exports: [DemoModule],
})
export class ScriptModule {}
