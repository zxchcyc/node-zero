import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import {
  FindCmsReqBo,
  CreateCmsReqBo,
  CmsBo,
  FindOneCmsResBo,
  UpdateCmsReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindCmsResBo,
} from '../bo/cms.bo';
import { CmsService } from '../service/cms.service';
import { CmsAbstractFacadeService } from './cms.facade.abstract';

@Injectable()
export class CmsFacadeService
  extends BaseService
  implements CmsAbstractFacadeService
{
  constructor(private readonly cmsService: CmsService) {
    super(CmsFacadeService.name);
  }
  async count(data: FindCmsReqBo): Promise<number> {
    return this.cmsService.count(data);
  }
  async getPaging(data: FindCmsReqBo): Promise<FindCmsResBo[]> {
    return this.cmsService.find(data);
  }
  async create(data: CreateCmsReqBo): Promise<CmsBo> {
    return this.cmsService.create(data);
  }
  async findById(id: number): Promise<FindOneCmsResBo> {
    return this.cmsService.findById(id);
  }
  async updateById(id: number, data: UpdateCmsReqBo): Promise<void> {
    return this.cmsService.updateById(id, data);
  }
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    return this.cmsService.batchDelete(data);
  }
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    return this.cmsService.batchUpdate(data);
  }
}
