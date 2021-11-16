/*
 * @Author: archer zheng
 * @Date: 2021-09-17 21:18:17
 * @LastEditTime: 2021-11-15 23:16:50
 * @LastEditors: archer zheng
 * @Description: 分布式锁
 * @FilePath: /node-zero/src/internal/lock/lock.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { EnvService } from 'src/internal/env/env.service';
import { getContext } from 'src/common';
import { createHash } from 'crypto';

@Injectable()
export class LockService {
  private logger: Logger = new Logger(LockService.name);
  public redis: Redis;
  constructor(
    private readonly redisService: RedisService,
    private readonly envService: EnvService,
  ) {
    this.redis = this.redisService.getClient(this.envService.get('REDIS_NAME'));
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * redis 带重试加锁 注意：业务获取锁重试时间只能小于过期时间
   * @param key {string} redis key
   * @param value {string} redis value
   * @param expiredTime {number} expired time s
   * @returns
   *    string  'OK' | NULL
   */
  async lockWithRetry(
    key: string,
    value: string = getContext('traceId'),
    expiredTime: number = 60 * 10, // 10分钟
    reTryCount: number = 30 * 10, // 30s
  ): Promise<string> {
    let flag: string;
    while (reTryCount > 0) {
      flag = await this.tryLock(key, value, expiredTime);
      if (flag) {
        break;
      }
      await this.sleep(100);
      --reTryCount;
      this.logger.warn('reTryCount', reTryCount);
    }
    return flag;
  }

  /**
   * redis 加锁 注意：业务获取锁重试时间只能小于过期时间
   * @param key {string} redis key
   * @param value {string} redis value
   * @param expiredTime {number} expired time s
   * @returns
   *    string  'OK' | NULL
   */
  async tryLock(
    key: string,
    value: string = getContext('traceId'),
    expiredTime: number = 60 * 10,
  ): Promise<string> {
    // EX seconds 设置键key的过期时间，单位时秒
    // PX milliseconds 设置键key的过期时间，单位时毫秒
    // NX 只有键key不存在的时候才会设置key的值
    // XX 只有键key存在的时候才会设置key的值
    return await this.redis.set(key, value, 'EX', expiredTime, 'NX');
  }

  /**
   * redis 释放锁 注意：只能释放自己创建的锁
   * @param key {string} redis key
   * @param value {string} redis value
   * @returns
   *    number  1 | 0
   */
  async releaseLock(key: string, value: string = getContext('traceId')) {
    // 释放锁
    const luaReleaseLockScript =
      "if redis.call('get',KEYS[1]) == ARGV[1] then " +
      "return redis.call('del',KEYS[1]) else return 0 end";
    this.redis.defineCommand('releaseLock', {
      numberOfKeys: 1,
      lua: luaReleaseLockScript,
    });
    return await this.redis['releaseLock'](key, value);
  }

  /**
   * 生成缓存key
   * @param {Object} options
   * @param {String} options.method 方法名
   * @param {String} options.params 方法参数
   * @param {String} module 业务根据需求拼接
   * @param {String} prefix 前缀
   */
  genKey(
    options: { method: any; params: any },
    module: string,
    prefix: string,
  ): string {
    const hash = createHash('sha1')
      .update(
        JSON.stringify({
          method: options.method,
          params: options.params,
        }),
      )
      .digest('hex');
    return [prefix, module, hash].join(':');
  }

  /**
   * redis 设置缓存
   * @param key {string} redis key
   * @param value {string} redis value
   * @param ttl {number|string} expired time s 默认24小时
   * @returns
   *    string  'OK' | NULL
   */
  async setCache(key: string, value: any, ttl: string | number = 60 * 60 * 24) {
    // EX seconds 设置键key的过期时间，单位时秒
    // PX milliseconds 设置键key的过期时间，单位时毫秒
    // NX 只有键key不存在的时候才会设置key的值
    // XX 只有键key存在的时候才会设置key的值
    return await this.redis.set(key, JSON.stringify(value), 'EX', ttl, 'NX');
  }

  /**
   * redis 读缓存
   * @param key {string} redis key
   * @returns
   *    string
   */
  async getCache(key: string) {
    const result = await this.redis.get(key);
    if (!result) {
      return;
    }
    return JSON.parse(result);
  }
}
