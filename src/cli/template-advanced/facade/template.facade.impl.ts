import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import {
  FindTemplateReqBo,
  CreateTemplateReqBo,
  TemplateBo,
  FindOneTemplateResBo,
  UpdateTemplateReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindTemplateResBo,
} from '../bo/template.bo';
import { TemplateService } from '../service/template.service';
import { TemplateAbstractFacadeService } from './template.facade.abstract';

@Injectable()
export class TemplateFacadeService
  extends BaseService
  implements TemplateAbstractFacadeService
{
  constructor(private readonly templateService: TemplateService) {
    super(TemplateFacadeService.name);
  }
  async count(data: FindTemplateReqBo): Promise<number> {
    return this.templateService.count(data);
  }
  async find(data: FindTemplateReqBo): Promise<FindTemplateResBo[]> {
    return this.templateService.find(data);
  }
  async create(data: CreateTemplateReqBo): Promise<TemplateBo> {
    return this.templateService.create(data);
  }
  async findById(id: number): Promise<FindOneTemplateResBo> {
    return this.templateService.findById(id);
  }
  async updateById(id: number, data: UpdateTemplateReqBo): Promise<void> {
    return this.templateService.updateById(id, data);
  }
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    return this.templateService.batchDelete(data);
  }
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    return this.templateService.batchUpdate(data);
  }
}
