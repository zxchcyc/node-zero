import { In, Like } from 'typeorm';
import * as _ from 'lodash';

export function findCondition(queryBuilder: any, data: any, likeKeys?: any[]) {
  for (const [k, v] of Object.entries(
    _.omit(data, ['page', 'limit', 'sortField']),
  )) {
    if (!_.isNil(v) && _.isString(v) && k === 'keyword') {
      queryBuilder = queryBuilder.andWhere(
        likeKeys.map((e) => {
          return { [e]: Like(`${v}%`) };
        }),
      );
      continue;
    }
    if (!_.isNil(v) && _.isString(v)) {
      // 默认字符串类型不要like查询
      queryBuilder = queryBuilder.andWhere([{ [k]: v }]);
      continue;
    }
    if (!_.isNil(v) && _.isArray(v)) {
      queryBuilder = queryBuilder.andWhere([
        // ids=>id
        { [k.replace(/s$/, '')]: In(v) },
      ]);
      continue;
    }
    if (!_.isNil(v)) {
      queryBuilder = queryBuilder.andWhere([{ [k]: v }]);
      continue;
    }
  }
}

export function orderByFix(sortField: string): Record<string, string> {
  if (!sortField) {
    return { id: 'DESC' };
  }
  const result: Record<string, string> = {};
  sortField.split(',').forEach((item) => {
    if (item.startsWith('-')) {
      result[item.substring(1)] = 'DESC';
    } else {
      result[item] = 'ASC';
    }
  });
  return result;
}
