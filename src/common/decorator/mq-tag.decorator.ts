/*
 * @Author: archer zheng
 * @Date: 2021-11-08 14:54:10
 * @LastEditTime: 2021-12-17 17:48:37
 * @LastEditors: archer zheng
 * @Description: MQTag 转发
 */
export function MQTag(tags: string[]): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    if (!Reflect.hasMetadata('MQTag', target.constructor)) {
      Reflect.defineMetadata('MQTag', {}, target.constructor);
    }
    const router = Reflect.getMetadata('MQTag', target.constructor);
    tags.forEach((tag) => (router[tag] = descriptor.value));
    Reflect.defineMetadata('MQTag', router, target.constructor);
  };
}
