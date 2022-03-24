import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function ReturnTypeValidate(returnType: any): MethodDecorator {
  return (
    target: any,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const data = await originalMethod.apply(this, [...args]);
      const entity = plainToClass(returnType, data);
      const errors = [].concat(await validate(entity));
      if (errors.length > 0) {
        throw Error('出参校验不通过' + JSON.stringify(errors));
      }
      return data;
    };
    return descriptor;
  };
}
