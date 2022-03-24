/*
 * @Author: archer zheng
 * @Date: 2020-12-14 16:28:03
 * @LastEditTime: 2022-03-17 12:08:12
 * @LastEditors: archer zheng
 * @Description: 定时任务装饰器 根据环境变量决定是否启动定时任务 TASK_ENABLED
 */
import { v4 as uuidv4 } from 'uuid';
import { createClsNamespace } from '../context';
const clsNamespace = createClsNamespace('scheduleContext');

interface Options {
  lock: boolean;
  prefix: string;
}

export function TaskProcess(options?: Options): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (!['1', 'true', 'TRUE'].includes(process.env.TASK_ENABLED)) {
        this.logger.verbose('TASK_ENABLED FALSE');
        return;
      }
      if (options?.lock) {
        const key = `lock:task:${options.prefix}:${
          target.constructor.name
        }:${String(methodName)}`;
        try {
          const locked = await this.lockService.tryLock(
            key,
            key,
            5 * 60, // 过期时间5分钟
          );
          if (!locked) {
            this.logger.warn('获取不到锁');
            return;
          }
          await this.lockService.releaseLock(key, key);

          // 设置上下文
          clsNamespace.runPromise(async () => {
            clsNamespace.set('traceId', uuidv4());
          });
          return await originalMethod.apply(this, [...args]);
        } catch (error) {
          this.logger.error(error);
        }
      }
      return await originalMethod.apply(this, [...args]);
    };
    return descriptor;
  };
}
