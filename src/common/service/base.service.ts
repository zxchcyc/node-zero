import { Logger, Inject } from '@nestjs/common';
import { LockService } from 'src/internal/lock/lock.service';
import { EnvService } from 'src/internal/env/env.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { WebhookService } from 'src/external/webhook/webhook.service';
import { RowCacheService } from 'src/external/row-cache/row-cache.service';
import { AbstractRocketmqService } from 'src/external/rocketmq/adapter/rocketmq.service.abstract';
import { AbstractBullMqService } from 'src/external/bullmq/adapter/bullmq.service.abstract';
import { LimitService } from 'src/internal/limit/limit.service';
import { KafkaProducerService } from 'src/external/kafka/Producer.service';

/**
 * 抽象基础服务
 *
 */
export abstract class BaseService {
  @Inject()
  protected readonly bullmqService: AbstractBullMqService;
  @Inject()
  protected readonly rocketmqService: AbstractRocketmqService;
  @Inject()
  protected readonly kafkaProducerService: KafkaProducerService;
  @Inject()
  protected readonly lockService: LockService;
  @Inject()
  protected readonly limitService: LimitService;
  @Inject()
  protected readonly envService: EnvService;
  @Inject()
  protected readonly webhookService: WebhookService;
  protected logger: Logger;
  protected _: _.LoDashStatic;
  protected moment: typeof moment;
  @Inject()
  protected readonly c: RowCacheService;

  protected constructor(serviceName: string) {
    this._ = _;
    this.moment = moment;
    this.logger = new Logger(serviceName);
  }

  // 列表补充数据通用方法(一对一、不跨表)
  protected async batchOneToOneFilling(
    // 数据集
    data: any[],
    // 指定字段
    refKey: string,
    // 获取所需要补充信息的方法
    entityFun: (ids: number[]) => Promise<any[]>,
    // 获取所需要信息字段
    entityKey: string | string[],
    // 放在数据集哪个字段上
    dataKey: string,
    // 关联的字段是哪个，一般是id
    keyBy = 'id',
  ) {
    try {
      const ids = Array.from(new Set(data.map((e) => e[refKey])));
      // this.logger.debug(ids);
      const entitys = await entityFun(ids);
      // this.logger.debug(entitys);
      const entitysObj = this._.keyBy(entitys, keyBy);
      data.forEach((data) => {
        if (this._.isString(entityKey)) {
          data[dataKey] = entitysObj[data[refKey]]?.[entityKey];
        } else {
          data[dataKey] = this._.pick(entitysObj[data[refKey]], entityKey);
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
    return;
  }

  // 列表补充数据通用方法(多对多、跨表)
  protected async batchManyToManyFilling(
    // 数据集
    data: any[],
    // 多对多关系表获取关系集的方法
    refFun: (ids: number[]) => Promise<any[]>,
    // 多对多关系相关键{ rid: 'uid' },
    refObject: Record<string, string>,
    // 获取所需要补充信息的方法
    entityFun: (ids: number[]) => Promise<any[]>,
    // 获取所需要信息字段
    entityKey: string | string[],
    // 放在数据集哪个字段上
    dataKey: string,
    // 关联的字段是哪个，一般是id
    keyBy = 'id',
  ) {
    try {
      const refKey = Object.keys(refObject)[0];
      const refValue = Object.values(refObject)[0];
      const ids = data.map((e) => e.id);
      const refs = await refFun(ids);
      const refids = Array.from(new Set(refs.map((e) => e[refKey])));
      const entitys = await entityFun(refids);
      const refsObj = this._.groupBy(refs, refValue);
      const entitysObj = this._.keyBy(entitys, keyBy);
      // this.logger.debug('===refsObj===', refsObj);
      // this.logger.debug('===entitysObj===', entitysObj);
      data.forEach((data) => {
        if (this._.isString(entityKey)) {
          const set = new Set<string>();
          refsObj[data.id]?.forEach((ref) => {
            set.add(entitysObj[ref[refKey]]?.[entityKey]);
          });
          data[dataKey] = [...set].filter((e) => e).join(',');
        } else {
          const array = [];
          refsObj[data.id]?.forEach((ref) => {
            array.push(this._.pick(entitysObj[ref[refKey]], entityKey));
          });
          data[dataKey] = array;
        }
      });
      // this.logger.debug(data);
      return {
        data,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  async takeWithCache(
    // 从该key获取缓存 获取不到从query拿并设置会key，空值也设置
    key: string,
    query: (conditions: Record<string, any> | any) => Promise<any>,
    // query参数
    queryConds: Record<string, any> | any,
    // query 放回哪个字段
    queryRetKet: string,
  ): Promise<any[]> {
    const keyExist = await this.lockService.redis.exists(key);
    // this.logger.debug('===key===', keyExist);
    // key 是否存在
    if (keyExist) {
      return JSON.parse(await this.lockService.redis.get(key));
    } else {
      // 请求DB;
      const dbData = await query(queryConds);
      const retValues = dbData.map((e) => e[queryRetKet]);
      await this.lockService.redis.set(key, JSON.stringify(retValues));
      return retValues;
    }
  }
}
