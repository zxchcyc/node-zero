/*
 * @Author: archer zheng
 * @Date: 2020-12-14 16:28:03
 * @LastEditTime: 2021-11-12 13:12:02
 * @LastEditors: archer zheng
 * @Description: MQ参数校验 注意使用顺序 
  @MQTag(['demo'])
  @MQValidate()
 * @FilePath: /node-zero/src/common/decorator/mq-validate.decorator.ts
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
        console.error(errors);
        throw Error('参数校验不通过');
      } else {
        return await originalMethod.apply(this, [...args]);
      }
    };
  };
}
