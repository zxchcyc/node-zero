/*
 * @Author: archer zheng
 * @Date: 2021-11-09 14:04:08
 * @LastEditTime: 2021-12-17 17:48:33
 * @LastEditors: archer zheng
 * @Description: context 上下文处理 结合 cls-hooked
 */

import { createClsNamespace } from '../context';
const clsNamespace = createClsNamespace('mqContext');

export function ProcessContext(): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      return clsNamespace.runPromise(async () => {
        if (args.length) {
          const context = args[0].data?.$context;
          if (context) {
            for (const [key, value] of Object.entries(context)) {
              clsNamespace.set(key, value);
            }
          }
        }
        return originalMethod.apply(this, args);
      });
    };
    return descriptor;
  };
}
