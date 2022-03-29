import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  FindDictReqBo,
  FindDictResBo,
  FindOneDictResBo,
  CreateDictReqBo,
  DictBo,
  UpdateDictReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/dict.bo';
import { DictAbstractRepoService } from '../repository/dict.abstract';

@Injectable()
export class DictService extends BaseService {
  constructor(private readonly dictRepoService: DictAbstractRepoService) {
    super(DictService.name);
  }

  async count(data: FindDictReqBo): Promise<number> {
    return this.dictRepoService.count(data);
  }

  async find(data: FindDictReqBo): Promise<FindDictResBo[]> {
    const result = await this.dictRepoService.find(data);
    return result;
  }

  async findById(id: number): Promise<FindOneDictResBo> {
    const result = await this.dictRepoService.findById(id);
    return result;
  }

  async create(data: CreateDictReqBo): Promise<DictBo> {
    const { type, key } = data;
    const dictExist = await this.dictRepoService.findByTypeAndKey(type, key);
    if (dictExist) {
      throw new BadRequestException('A1100');
    }
    const result = await this.dictRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateDictReqBo): Promise<void> {
    const { type, key } = data;
    const dictExist = await this.dictRepoService.findByTypeAndKey(type, key);
    if (dictExist && dictExist.id !== id) {
      throw new BadRequestException('A1100');
    }
    const result = await this.dictRepoService.updateById(id, data);
    return result;
  }

  async deleteById(id: number): Promise<void> {
    return await this.dictRepoService.deleteById(id);
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
      ops.push(this.updateById(id, this._.pick(data, ['status']))),
    );
    ops.length && (await Promise.all(ops));
    return;
  }
}
