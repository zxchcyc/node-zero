/*
 * @Author: archer zheng
 * @Date: 2020-12-14 16:28:03
 * @LastEditTime: 2021-11-15 13:33:07
 * @LastEditors: archer zheng
 * @Description: 日志调试
 * @FilePath: /node-zero/src/common/decorator/logger-debug.decorator.ts
 */
export function LoggerDebug(): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let logger: Console;
      if (this.logger) {
        logger = this.logger;
      } else {
        logger = console;
      }
      const t1: number = Date.now();
      logger.debug(`===${methodName.toString()}===`, args);
      const result = await originalMethod.apply(this, [...args]);
      logger.debug(
        `===${methodName.toString()}===`,
        `耗时: ${Date.now() - t1}ms`,
      );
      return result;
    };
    return descriptor;
  };
}
