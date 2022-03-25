import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserAbstractRepoService } from './user.abstract';
import { FindUserReqBo, FindUserResBo } from '../bo/user.bo';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class UserRepoService
  extends BaseCacheTyprOrmService<UserEntity>
  implements UserAbstractRepoService
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    super(userRepo, UserRepoService.name);
  }

  async find(data: FindUserReqBo): Promise<FindUserResBo[]> {
    const orderBy = { isTop: 'DESC', sort: 'ASC', id: 'DESC' };
    const result = await super.find(data, orderBy as OrderByCondition);
    return result;
  }
}
