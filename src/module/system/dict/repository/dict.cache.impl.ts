import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictEntity } from './dict.entity';
import { DictAbstractRepoService } from './dict.abstract';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class DictRepoService
  extends BaseCacheTyprOrmService<DictEntity>
  implements DictAbstractRepoService
{
  constructor(
    @InjectRepository(DictEntity)
    private readonly dictRepo: Repository<DictEntity>,
  ) {
    super(dictRepo, DictRepoService.name);
  }
}
