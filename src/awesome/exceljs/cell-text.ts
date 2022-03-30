import * as _ from 'lodash';

/**
 * 将Excel 单元格内容提取出来
 * @param v excel 单元格内容 可能会带样式信息
 * @returns string
 */
export function cellText(v: any): string {
  if (v instanceof Object) {
    return _.isNil(v.text) ? '' : v.text;
  }
  return _.isNil(v) ? '' : v;
}
