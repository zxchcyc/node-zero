/*
 * @Author: archer zheng
 * @Date: 2021-11-15 15:06:37
 * @LastEditTime: 2021-11-15 15:48:50
 * @LastEditors: archer zheng
 * @Description: 表结构配置
 * @FilePath: /node-zero/src/module/clean-crf-task/constant/vtestitem-fields-constant.ts
 */

import { EFieldType } from '../service/table-template';

export const VTESTITEM_FIELDS = [
  // 规则字段
  {
    name: '$subjid',
    comment: '受试者编码',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$siteCode',
    comment: '中心编码',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$visitName',
    comment: '访视名称',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$testitem',
    comment: '检验项',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$value',
    comment: '采样日期ibdat最新情况下的值',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$unit',
    comment: '单位',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$up',
    comment: '上限',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$down',
    comment: '下限',
    type: EFieldType.string,
    default: null,
  },
];

export const VTESTITEM_INDEXS = [
  {
    keys: ['$subjid'],
    comment: '受试者编码',
    name: '$subjid_index',
  },
];
