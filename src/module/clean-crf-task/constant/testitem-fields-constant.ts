/*
 * @Author: archer zheng
 * @Date: 2021-11-15 15:06:37
 * @LastEditTime: 2021-11-15 15:48:41
 * @LastEditors: archer zheng
 * @Description: 表结构配置
 * @FilePath: /node-zero/src/module/clean-crf-task/constant/testitem-fields-constant.ts
 */

import { EFieldType } from '../service/table-template';

export const TESTITEM_FIELDS = [
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
    name: '$randarm',
    comment: '组别',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$sex',
    comment: '性别',
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
  {
    name: '$maxValue',
    comment: '基线值',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$maxUnit',
    comment: '基线值单位',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$minValue',
    comment: '随访结束值',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$minUnit',
    comment: '随访结束值单位',
    type: EFieldType.string,
    default: null,
  },
];

export const TESTITEM_INDEXS = [
  {
    keys: ['$subjid'],
    comment: '受试者编码',
    name: '$subjid_index',
  },
];
