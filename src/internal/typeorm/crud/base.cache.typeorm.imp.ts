import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { DeepPartial, OrderByCondition, Repository } from 'typeorm';
import { findCondition, orderByFix } from './condition';
type Paging = {
  page?: number;
  limit?: number;
  sortField?: string;
};

@Injectable()
export class BaseCacheTyprOrmService<T> extends BaseService {
  tableName = null;
  constructor(private readonly repo: Repository<T>, serviceName: string) {
    super(serviceName);
    this.tableName = repo.metadata.tableName;
  }

  async count(
    data: Partial<T> & Paging,
    likeKeys?: Array<keyof T>,
  ): Promise<number> {
    const queryBuilder = this.repo.createQueryBuilder();
    findCondition(queryBuilder, data, likeKeys);
    return queryBuilder.getCount();
  }

  async find(
    data: Partial<T> & Paging,
    orderBy?: OrderByCondition,
    likeKeys?: Array<keyof T>,
  ): Promise<Partial<T>[]> {
    const { page, limit } = data;
    orderBy = orderBy || (orderByFix(data.sortField) as OrderByCondition);
    this.logger.debug(orderBy);
    const queryBuilder = this.repo
      .createQueryBuilder()
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(orderBy);
    findCondition(queryBuilder, data, likeKeys);
    return queryBuilder.getMany();
  }

  async findById(id: number): Promise<T> {
    const key = this.c.keyer(this.tableName, id);
    const result = await this.c.queryRow(
      id,
      key,
      this.repo.findOne.bind(this.repo),
    );
    return result;
  }

  async create(data: T): Promise<T> {
    return this.repo.save(data as unknown as DeepPartial<T>[]) as unknown as T;
  }

  async updateById(id: number, data: T): Promise<void> {
    await this.repo.update(id, data);
    const key = this.c.keyer(this.tableName, id);
    await this.lockService.doubleDel(key);
    return;
  }

  async deleteById(id: number): Promise<void> {
    await this.repo.softDelete(id);
    const key = this.c.keyer(this.tableName, id);
    await this.lockService.doubleDel(key);
    return;
  }
}
