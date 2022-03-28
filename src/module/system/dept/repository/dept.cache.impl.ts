import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { DeptEntity } from './dept.entity';
import { DeptAbstractRepoService } from './dept.abstract';
import { FindDeptResBo, FindOneDeptResBo } from '../bo/dept.bo';
import { BaseCacheTyprOrmService } from 'src/internal/typeorm/crud/base.cache.typeorm.imp';

@Injectable()
export class DeptRepoService
  extends BaseCacheTyprOrmService<DeptEntity>
  implements DeptAbstractRepoService
{
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepo: Repository<DeptEntity>,
  ) {
    super(deptRepo, DeptRepoService.name);
  }

  async findByCode(code: string): Promise<FindOneDeptResBo> {
    return this.deptRepo.findOne({ code });
  }

  async getChilds(chain: string): Promise<FindDeptResBo[]> {
    const result = await this.deptRepo
      .createQueryBuilder()
      .where([{ chain: Like(`${chain}%`) }])
      .orderBy({ level: 'DESC' })
      .getMany();
    return result;
  }
}
