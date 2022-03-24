import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { CmsEntity } from './cms.entity';
import { CmsAbstractRepoService } from './cms.abstract';
import { FindCmsReqBo, FindCmsResBo } from '../bo/cms.bo';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class CmsRepoService
  extends BaseCacheTyprOrmService<CmsEntity>
  implements CmsAbstractRepoService
{
  constructor(
    @InjectRepository(CmsEntity)
    private readonly cmsRepo: Repository<CmsEntity>,
  ) {
    super(cmsRepo, CmsRepoService.name);
  }

  async find(data: FindCmsReqBo): Promise<FindCmsResBo[]> {
    const orderBy = { isTop: 'DESC', sort: 'ASC', id: 'DESC' };
    const result = await super.find(data, orderBy as OrderByCondition);
    return result;
  }
}
