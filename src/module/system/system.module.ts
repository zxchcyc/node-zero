import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  exports: [AuthModule],
  providers: [],
})
export class SystemModule {}
