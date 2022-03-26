import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [AuthModule, LoginModule],
  exports: [AuthModule, LoginModule],
  providers: [],
})
export class SystemModule {}
