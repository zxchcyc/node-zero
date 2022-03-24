/*
 * @Author: archer zheng
 * @Date: 2021-11-15 22:40:08
 * @LastEditTime: 2022-01-20 12:05:05
 * @LastEditors: archer zheng
 * @Description: 防止缓存击穿之进程内共享调用
 */
export function SharedCalls(
  ttl = 1, //过期时间 s
): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const key = this.lockService.genKey(
        {
          method: methodName,
          params: args,
        },
        target.constructor.name,
        'sharedCalls',
      );
      this.logger.warn(key);
      const cache = await this.lockService.getCache(key);
      if (cache) {
        this.logger.warn(key, '从缓存读取数据');
        return cache;
      }

      // 加锁;
      const lock = await this.lockService.tryLock(`lock:${key}`);
      if (!lock) {
        let cache: string;
        let count = 0;
        do {
          this.logger.warn(key, count, '获取不到锁,等待缓存有数据');
          count++;
          await this.lockService.sleep(100);
          cache = await this.lockService.getCache(key);
        } while (!cache && count <= 150);
        if (cache) {
          this.logger.warn(key, '从缓存读取数据');
          return cache;
        } else {
          this.logger.warn(key, '从DB读取数据');
          return await originalMethod.apply(this, [...args]);
        }
        // 兜底时间15s 还没有数据从数据库拿
      }
      this.logger.warn(key, '从DB读取数据');
      try {
        const data = await originalMethod.apply(this, [...args]);
        await this.lockService.setCache(key, data, ttl);
        return data;
      } catch (error) {
        throw error;
      } finally {
        // 释放锁
        await this.lockService.releaseLock(`lock:${key}`);
      }
    };
    return descriptor;
  };
}
