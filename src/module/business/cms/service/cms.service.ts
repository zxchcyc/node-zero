import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  FindCmsReqBo,
  FindCmsResBo,
  FindOneCmsResBo,
  CreateCmsReqBo,
  CmsBo,
  UpdateCmsReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/cms.bo';
import { ECmsStatus } from '../enum/cms.enum';
import { CmsAbstractRepoService } from '../repository/cms.abstract';

@Injectable()
export class CmsService extends BaseService {
  constructor(private readonly cmsRepoService: CmsAbstractRepoService) {
    super(CmsService.name);
  }

  async count(data: FindCmsReqBo): Promise<number> {
    return this.cmsRepoService.count(data);
  }

  async find(data: FindCmsReqBo): Promise<FindCmsResBo[]> {
    const result = await this.cmsRepoService.find(data);
    return result;
  }

  async findById(id: number): Promise<FindOneCmsResBo> {
    const result = await this.cmsRepoService.findById(id);
    return result;
  }

  async create(data: CreateCmsReqBo): Promise<CmsBo> {
    data.pubAt = new Date();
    const result = await this.cmsRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateCmsReqBo): Promise<void> {
    const { status } = data;
    if (status === ECmsStatus.done) {
      data.pubAt = new Date();
    }
    const result = this.cmsRepoService.updateById(id, this._.omit(data, []));
    return result;
  }

  async deleteById(id: number): Promise<void> {
    return this.cmsRepoService.deleteById(id);
  }

  @Transactional()
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) => ops.push(this.deleteById(id)));
    ops.length && (await Promise.all(ops));
    return;
  }

  @Transactional()
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) =>
      ops.push(
        this.updateById(id, this._.pick(data, ['status', 'isTop', 'sort'])),
      ),
    );
    ops.length && (await Promise.all(ops));
    return;
  }
}
