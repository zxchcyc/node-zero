/*
 * @Author: archer zheng
 * @Date: 2021-11-15 22:40:08
 * @LastEditTime: 2022-03-11 15:11:20
 * @LastEditors: archer zheng
 * @Description: 重试（基础版）
 */

export function BaseRetry(
  limitCount = 1, //重试次数
  sleepTime = 10, //重试间隔 ms
): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let pass = true;
      let retryCount = 0;
      do {
        try {
          const data = await originalMethod.apply(this, [...args]);
          return data;
        } catch (error) {
          retryCount++;
          if (retryCount <= limitCount) {
            // console.debug('===retryCount===', retryCount, new Date());
            pass = false;
          } else {
            pass = true;
            throw error;
          }
          await this.lockService.sleep(sleepTime);
        }
      } while (!pass);
    };
    return descriptor;
  };
}
