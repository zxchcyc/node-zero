import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { OrderByCondition, Repository } from 'typeorm';
import { findCondition, orderByFix } from './condition';
type Paging = {
  page?: number;
  limit?: number;
  sortField?: string;
  keyword?: string;
};

@Injectable()
export class BaseTyprOrmService<T> extends BaseService {
  constructor(private readonly repo: Repository<T>, serviceName: string) {
    super(serviceName);
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
    return await this.repo.findOne(id);
  }

  async create(data: T): Promise<T> {
    return this.repo.save(data);
  }

  async updateById(id: number, data: T): Promise<void> {
    await this.repo.update(id, data);
    return;
  }

  async deleteById(id: number): Promise<void> {
    await this.repo.softDelete(id);
    return;
  }
}
