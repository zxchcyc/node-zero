import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  FindTemplateReqBo,
  FindTemplateResBo,
  FindOneTemplateResBo,
  CreateTemplateReqBo,
  TemplateBo,
  UpdateTemplateReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/template.bo';
import { ETemplateStatus } from '../enum/template.enum';
import { TemplateAbstractRepoService } from '../repository/template.abstract';

@Injectable()
export class TemplateService extends BaseService {
  constructor(
    private readonly templateRepoService: TemplateAbstractRepoService,
  ) {
    super(TemplateService.name);
  }

  async count(data: FindTemplateReqBo): Promise<number> {
    return this.templateRepoService.count(data);
  }

  async find(data: FindTemplateReqBo): Promise<FindTemplateResBo[]> {
    const result = await this.templateRepoService.find(data);
    return result;
  }

  async findById(id: number): Promise<FindOneTemplateResBo> {
    const result = await this.templateRepoService.findById(id);
    return result;
  }

  async create(data: CreateTemplateReqBo): Promise<TemplateBo> {
    data.pubAt = new Date();
    const result = await this.templateRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateTemplateReqBo): Promise<void> {
    const { status } = data;
    if (status === ETemplateStatus.done) {
      data.pubAt = new Date();
    }
    const result = await this.templateRepoService.updateById(
      id,
      this._.omit(data, []),
    );
    return result;
  }

  async deleteById(id: number): Promise<void> {
    return await this.templateRepoService.deleteById(id);
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
