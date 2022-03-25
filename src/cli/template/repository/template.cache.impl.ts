import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { TemplateEntity } from './template.entity';
import { TemplateAbstractRepoService } from './template.abstract';
import { FindTemplateReqBo, FindTemplateResBo } from '../bo/template.bo';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class TemplateRepoService
  extends BaseCacheTyprOrmService<TemplateEntity>
  implements TemplateAbstractRepoService
{
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templateRepo: Repository<TemplateEntity>,
  ) {
    super(templateRepo, TemplateRepoService.name);
  }

  async find(data: FindTemplateReqBo): Promise<FindTemplateResBo[]> {
    const orderBy = { isTop: 'DESC', sort: 'ASC', id: 'DESC' };
    const result = await super.find(data, orderBy as OrderByCondition);
    return result;
  }
}
