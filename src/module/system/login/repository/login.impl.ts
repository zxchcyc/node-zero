import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common';
import { Repository } from 'typeorm';
import { LoginAbstractRepoService } from './login.abstract';
import { LoginLogEntity } from './login-log.entity';
import { LoginLogBo } from '../bo/login.bo';

@Injectable()
export class LoginRepoService
  extends BaseService
  implements LoginAbstractRepoService
{
  constructor(
    @InjectRepository(LoginLogEntity)
    private readonly loginLogRepo: Repository<LoginLogEntity>,
  ) {
    super(LoginRepoService.name);
  }

  async save(loginLog: LoginLogBo) {
    await this.loginLogRepo.save(loginLog);
  }
}
