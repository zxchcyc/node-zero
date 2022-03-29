import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { RegionEntity } from './region.entity';
import { RegionAbstractRepoService } from './region.abstract';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';
import { FindRegionReqBo, FindRegionResBo, RegionBo } from '../bo/region.bo';

@Injectable()
export class RegionRepoService
  extends BaseCacheTyprOrmService<RegionEntity>
  implements RegionAbstractRepoService
{
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepo: Repository<RegionEntity>,
  ) {
    super(regionRepo, RegionRepoService.name);
  }

  async find(data: FindRegionReqBo): Promise<FindRegionResBo[]>{
    const orderBy = { code: 'ASC', };
    const result = await super.find(data, orderBy as OrderByCondition);
    return result;
  }
  async createMany(data: RegionBo[]): Promise<void>{
    await this.regionRepo.insert(data)
    return 
  }

}
