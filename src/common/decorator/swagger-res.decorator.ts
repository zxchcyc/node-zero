import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiCommResponse = <TModel extends Type>(
  type = 'empty',
  model: TModel = undefined,
) => {
  let result: any;
  if (type === 'array') {
    // 响应列表数据
    result = {
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    };
  } else if (type === 'paging') {
    // 响应分页数据
    result = {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(model) },
            },
          },
        },
      ],
    };
  } else if (type === 'obj') {
    // 响应对象数据
    result = { $ref: getSchemaPath(model) };
  } else if (type === 'empty') {
    // 响应空数据
    result = undefined;
  }

  return applyDecorators(
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          errorCode: {
            type: 'string',
            description: '错误码',
            example: '00000',
            enum: ['00000', 'A0002'],
          },
          message: {
            type: 'string',
            description: '错误消息',
            example: '一切 ok',
          },
          result,
        },
      },
    }),
  );
};
