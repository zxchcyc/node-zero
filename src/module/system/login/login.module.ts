import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAbstractFacadeService } from './facade/login.facade.abstract';
import { LoginFacadeService } from './facade/login.facade.impl';
import { LoginAbstractRepoService } from './repository/login.abstract';
import { LoginRepoService } from './repository/login.impl';
import { LoginLogEntity } from './repository/login-log.entity';
import { LoginService } from './service/login.service';
import { VerifyCodeService } from './service/verify-code.service';
import { WebLoginController } from './application/http/web/v1/login.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoginLogEntity])],
  controllers: [WebLoginController],
  providers: [
    {
      provide: LoginAbstractFacadeService,
      useClass: LoginFacadeService,
    },
    {
      provide: LoginAbstractRepoService,
      useClass: LoginRepoService,
    },
    LoginService,
    VerifyCodeService,
  ],
  exports: [],
})
export class LoginModule {}
