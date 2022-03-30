import { Injectable } from '@nestjs/common';
import { LockService } from 'src/internal/lock/lock.service';
import * as _ from 'lodash';

@Injectable()
export class RowCacheService {
  constructor(private readonly lockService: LockService) {}

  keyer = (tableName: string, id: number) => `cache:${tableName}:primary:${id}`;
  indexKeyer = (tableName: string, indexs: Record<string, any>) =>
    `cache:${tableName}:${Object.keys(indexs).join('-')}:${Object.values(
      indexs,
    ).join('-')}`;
  tableName = (key: string) => key.split(':')[1];

  private CACHE_SAFEGAP_BETWEEN_INDEX_AND_PRIMARY = 5;
  private PRIMARY_EXPIRY = 7 * 24 * 60 * 60;
  private INDEX_PRIMARY_EXPIRY = 7 * 24 * 60 * 60;
  private NOTFOUNDPLACEHOLDER = '*';
  // 使不稳定的到期时间为 [950, 1050]ms
  private EXPIRY = _.random(950, 1050);

  async queryRow(
    id: number,
    key: string,
    query: (conditions: Record<string, any>) => Promise<any>,
  ) {
    return this.take(id, key, query);
  }

  private async take(
    id: number,
    key: string,
    query: (conditions: Record<string, any>) => Promise<any>,
  ) {
    return this.doTake(id, key, query);
  }

  private async doTake(
    id: number,
    key: string,
    query: (conditions: Record<string, any>) => Promise<any>,
  ) {
    // 用 barrier 来防止缓存击穿，确保一个进程内只有一个请求去加载key对应的数据
    // 从cache里读取数据;
    const data = await this.lockService.redis.get(key);
    if (data === this.NOTFOUNDPLACEHOLDER) {
      // 如果是预先放进来的placeholder（用来防止缓存穿透）的，那么就返回空
      return null;
    }
    // 如果是未知错误，那么就直接返回，因为我们不能放弃缓存出错而直接把所有请求去请求DB,这样在高并发的场景下会把DB打挂掉的
    if (!data) {
      // 请求DB;
      const dbData = await query({ id });
      if (!dbData) {
        // 如果返回空，那么我们就需要在缓存里设置placeholder，防止缓存穿透
        await this.lockService.redis.set(
          key,
          this.NOTFOUNDPLACEHOLDER,
          'PX',
          this.EXPIRY,
        );
        // 统计DB失败
        return null;
      }
      // 把数据写入缓存
      await this.lockService.redis.set(
        key,
        JSON.stringify(dbData),
        'EX',
        this.PRIMARY_EXPIRY,
      );
      // 返回json序列化的数据
      return dbData;
    }
    // 统计缓存命中率
    return JSON.parse(data);
  }

  private async takeWithExpire(
    indexs: Record<string, any>,
    key: string,
    query: (conditions: Record<string, any>) => Promise<any>,
  ) {
    // 请求DB;
    const dbData = await query(indexs);
    if (!dbData) {
      // 如果返回空，那么我们就需要在缓存里设置placeholder，防止缓存穿透
      await this.lockService.redis.set(
        key,
        this.NOTFOUNDPLACEHOLDER,
        'PX',
        this.EXPIRY,
      );
      return { dbData: [], primaryKey: null };
    }
    // 将索引到主键的映射保存到缓存了
    const primaryKey = dbData['id'];
    await this.lockService.redis.set(
      key,
      primaryKey,
      'EX',
      this.INDEX_PRIMARY_EXPIRY,
    );
    return { dbData, primaryKey };
  }

  // indexs - 查询条件
  // key - 通过索引生成的缓存key
  // keyer - 用主键生成基于主键缓存的key的方法
  // indexQuery - 用索引从DB读取完整数据的方法，需要返回主键
  // primaryQuery - 用主键从DB获取完整数据的方法
  async queryRowIndex(
    indexs: Record<string, any>,
    key: string,
    // keyer: (tableName: string, id: number) => string,
    indexQuery: (conditions: Record<string, any>) => Promise<any>,
    primaryQuery: (conditions: Record<string, any>) => Promise<any>,
  ) {
    // 先通过索引查询缓存，看是否有索引到主键的缓存
    const primaryCache = await this.lockService.redis.get(key);
    if (primaryCache) {
      if (primaryCache === this.NOTFOUNDPLACEHOLDER) {
        // 如果是预先放进来的placeholder（用来防止缓存穿透）的，那么就返回空
        return null;
      }
      // 通过主键从缓存读取数据，如果缓存没有，通过primaryQuery方法从DB读取并回写缓存再返回数据
      const primaryKey = Number(primaryCache);
      const data = await this.queryRow(
        primaryKey,
        this.keyer(this.tableName(key), primaryKey),
        primaryQuery,
      );
      return data;
    }

    // 如果没有索引到主键的缓存，那么就通过索引查询完整数据
    const { primaryKey, dbData } = await this.takeWithExpire(
      indexs,
      key,
      indexQuery,
    );
    if (!primaryKey) {
      return null;
    }

    // 将主键到完整数据的映射保存到缓存里，TakeWithExpire方法已经将索引到主键的映射保存到缓存了
    await this.lockService.redis.set(
      this.keyer(this.tableName(key), primaryKey),
      JSON.stringify(dbData),
      'EX',
      this.PRIMARY_EXPIRY + this.CACHE_SAFEGAP_BETWEEN_INDEX_AND_PRIMARY,
    );

    // 已经通过索引找到了数据，直接返回即可
    return dbData;
  }
}
