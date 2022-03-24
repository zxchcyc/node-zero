/*
 * @Author: archer zheng
 * @Date: 2020-12-14 16:28:03
 * @LastEditTime: 2022-03-23 15:19:50
 * @LastEditors: archer zheng
 * @Description: MQ参数校验 注意使用顺序 
  @MQTag([])
  @MQValidate()
 */

import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function MQValidate(): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const paramsTypes = Reflect.getMetadata(
        'design:paramtypes',
        target,
        methodName,
      );
      let errors = [];
      for (const index in paramsTypes) {
        const entity = plainToClass(paramsTypes[index], args[index]);
        errors = errors.concat(await validate(entity));
      }
      if (errors.length > 0) {
        // console.error(errors);
        throw Error('MQ参数校验不通过' + JSON.stringify(errors));
      } else {
        return await originalMethod.apply(this, [...args]);
      }
    };
    return descriptor;
  };
}
