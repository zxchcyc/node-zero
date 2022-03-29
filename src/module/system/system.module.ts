import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DeptModule } from './dept/dept.module';
import { LoginModule } from './login/login.module';
import { RoleModule } from './rbac/role.module';
import { RegionModule } from './region/region.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    LoginModule,
    RegionModule,
    UserModule,
    RoleModule,
    DeptModule,
    RegionModule,
  ],
  exports: [
    AuthModule,
    LoginModule,
    RegionModule,
    UserModule,
    RoleModule,
    DeptModule,
    RegionModule,
  ],
  providers: [],
})
export class SystemModule {}
