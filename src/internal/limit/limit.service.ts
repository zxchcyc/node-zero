/*
 * @Author: archer zheng
 * @Date: 2021-09-17 21:18:17
 * @LastEditTime: 2022-03-31 13:08:56
 * @LastEditors: archer zheng
 * @Description: 限流
 */
import { Logger, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EnvService } from 'src/internal/env/env.service';
import { RedisService } from 'node_modules_local/nestjs-redis';

@Injectable()
export class LimitService {
  keyer = (type: string, key: string) => `limit:${type}:${key}`;
  private logger: Logger = new Logger(LimitService.name);
  public redis: Redis;
  constructor(
    private readonly redisService: RedisService,
    private readonly envService: EnvService,
  ) {
    this.redis = this.redisService.getClient(this.envService.get('REDIS_NAME'));
  }

  /**
   * @description: 固定窗口限流
   * @param {string} key 访问资源的标示
   * @param {number} limit 请求总数,超过则限速。可设置为 QPS
   * @param {number} window 滑动窗口,用 ttl 模拟出滑动的效果
   * @return {number} 0 OverQuota 1 Allowed 2 HitQuota
   * @author: archer zheng
   */
  async periodLimit(
    key: string,
    limit: number,
    window: number,
  ): Promise<number> {
    const luaPeriodLimitScript = `
      -- to be compatible with aliyun redis, 
      -- we cannot use local key = KEYS[1] to reuse thekey
      local limit = tonumber(ARGV[1])
      local window = tonumber(ARGV[2])
      -- incrbt key 1 => key visis++
      local current = redis.call("INCRBY", KEYS[1], 1)
      -- 如果是第一次访问,设置过期时间 => TTL = window size
      -- 因为是只限制一段时间的访问次数
      if current == 1 then
          redis.call("expire", KEYS[1], window)
          return 1
      elseif current < limit then
          return 1
      elseif current == limit then
          return 2
      else
          return 0
      end;`;
    this.redis.defineCommand('periodLimit', {
      numberOfKeys: 1,
      lua: luaPeriodLimitScript,
    });
    return await this.redis['periodLimit'](
      this.keyer('period', key),
      limit,
      window,
    );
  }

  /**
   * @description: 令牌桶限流
   * @param {string} tokenKey 表示资源的tokenkey
   * @param {string} key 表示刷新时间的key
   * @param {number} rate 每秒生成几个令牌
   * @param {number} capacity 令牌桶最大值
   * @param {number} now 当前时间戳
   * @param {number} requested 开发者需要获取的token数
   * @return {number} null | 1
   * @author: archer zheng
   */
  async tokenLimit(
    tokenKey: string,
    key: string,
    rate: number,
    capacity: number,
    now: number,
    requested: number,
  ): Promise<number> {
    const luaTokenLimitScript = `
      -- 返回是否可以获得预期的token
      local rate = tonumber(ARGV[1])
      local capacity = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local requested = tonumber(ARGV[4])

      -- fill_time: 需要填满 token_bucket 需要多久
      local fill_time = capacity/rate
      -- 将填充时间向下取整
      local ttl = math.floor(fill_time*2)

      -- 获取目前 token_bucket 中剩余 token 数
      -- 如果是第一次进入,则设置 token_bucket 数量为 令牌桶最大值
      local last_tokens = tonumber(redis.call("get", KEYS[1]))
      if last_tokens == nil then
          last_tokens = capacity
      end

      -- 上一次更新 token_bucket 的时间
      local last_refreshed = tonumber(redis.call("get", KEYS[2]))
      if last_refreshed == nil then
          last_refreshed = 0
      end

      local delta = math.max(0, now-last_refreshed)
      -- 通过当前时间与上一次更新时间的跨度,以及生产token的速率,计算出新的token数
      -- 如果超过 max_burst,多余生产的token会被丢弃
      local filled_tokens = math.min(capacity, last_tokens+(delta*rate))
      local allowed = filled_tokens >= requested
      local new_tokens = filled_tokens
      if allowed then
          new_tokens = filled_tokens - requested
      end

      -- 更新新的token数,以及更新时间
      redis.call("setex", KEYS[1], ttl, new_tokens)
      redis.call("setex", KEYS[2], ttl, now)

      return allowed  
    `;
    this.redis.defineCommand('tokenLimit', {
      numberOfKeys: 2,
      lua: luaTokenLimitScript,
    });
    return await this.redis['tokenLimit'](
      this.keyer('token', tokenKey),
      this.keyer('token', key),
      rate,
      capacity,
      now,
      requested,
    );
  }

  /**
   * @description: 漏斗限流
   * @param {string} funnelKey 表示资源的funnelkey
   * @param {string} key 表示刷新时间的key
   * @param {number} rate 每秒桶内数量的流失数
   * @param {number} capacity 桶最大值
   * @param {number} now 当前时间戳
   * @param {number} requested 开发者需要获取的token数
   * @return {number} 0 1
   * @author: archer zheng
   */
  async funnelLimit(
    funnelKey: string,
    key: string,
    rate: number,
    capacity: number,
    now: number,
    requested: number,
  ): Promise<number> {
    const luaFunnelLimitScript = `
      -- 返回是否可以放进漏斗
      local rate = tonumber(ARGV[1])
      local capacity = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local requested = tonumber(ARGV[4])

      -- fill_time: 需要填满 token_bucket 需要多久
      local fill_time = capacity/rate
      -- 将填充时间向下取整
      local ttl = math.floor(fill_time*2)
      
      -- 获取目前 funnel_bucket 中剩余 token 数
      -- 如果是第一次进入,则设置 funnel_bucket 数量为 0
      local last_tokens = tonumber(redis.call("get", KEYS[1]))
      if last_tokens == nil then
          last_tokens = 0
      end

      -- 上一次更新 token_bucket 的时间
      local last_refreshed = tonumber(redis.call("get", KEYS[2]))
      if last_refreshed == nil then
          last_refreshed = 0
      end

      local delta = math.max(0, now-last_refreshed)
      -- 通过当前时间与上一次更新时间的跨度,以及生产token的速率,计算出流出的token数
      -- 当前桶内的请求数量
      -- 若新的 new_tokens 没有达到最大容量 ，则允许继续请求，否则就忽视掉请求
      local new_tokens = math.ceil(math.max(0, last_tokens-(delta*rate)) + requested)
      local allowed = new_tokens <= capacity

      -- 更新新的token数,以及更新时间
      redis.call("setex", KEYS[1], ttl, new_tokens)
      redis.call("setex", KEYS[2], ttl, now)

      return allowed
    `;
    this.redis.defineCommand('funnelLimit', {
      numberOfKeys: 2,
      lua: luaFunnelLimitScript,
    });
    return await this.redis['funnelLimit'](
      this.keyer('funnel', funnelKey),
      this.keyer('funnel', key),
      rate,
      capacity,
      now,
      requested,
    );
  }
}
