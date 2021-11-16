/*
 * @Author: archer zheng
 * @Date: 2021-11-15 15:06:37
 * @LastEditTime: 2021-11-15 16:26:52
 * @LastEditors: archer zheng
 * @Description: 表结构配置
 * @FilePath: /node-zero/src/module/clean-crf-task/constant/base-fields-constant.ts
 */

import { EFieldType } from '../service/table-template';
export const BASE_INDEXS = [
  {
    keys: ['$subjid'],
    comment: '受试者编码',
    name: '$subjid_index',
  },
];

export const BASE_FIELDS = [
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
    name: '$exdoseExfrq',
    comment: '给药剂量加频率',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$vDsStatus',
    comment: '受试者是否完成试验',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$vDmAge',
    comment: '年龄',
    type: EFieldType.number,
    default: null,
  },
  {
    name: '$vDmSex',
    comment: '性别',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$lVsVisdat',
    comment: '最后一个访视日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: '$lVsVisname',
    comment: '最后一个访视日期名字',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$randnum',
    comment: '是否随机入组',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$ex',
    comment: '是否接受药物治疗',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$age',
    comment: '年龄是否大于65岁',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$cycle',
    comment:
      '周期 性别 sex = 2 且是否绝经 mpyn = 1 下，知情同意书签署日期 icfdat - 绝经日期 mpdat 大于 24 W',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$edusp',
    comment: '文化程度范围是否小学以上',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$vDmEdusp',
    comment: '文化程度',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$fExExdat',
    comment: '首次给药日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: '$aestdatExdat',
    comment: '不良事件开始日期-首次给药日期 大于等于0的纳入统计',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$exdose',
    comment: '初始剂量',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$tumtype',
    comment: '肿瘤类型',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$uexdose',
    comment: '剂量单位',
    type: EFieldType.string,
    default: null,
  },
  {
    name: '$aeongo',
    comment: '不良事件是否持续',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$teae',
    comment:
      '不良事件开始日期-首次用药日期≥ 0，且在用药结束( exdat 最大值)后 30天内，算TEAE',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$trae',
    comment:
      'AE_aerel1.肯定有关 2. 很可能有关 3. 可能有关 4. 可能无关 5.肯定无关 TRAE判断题条件：1、2、3',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aeacn2',
    comment: '减少剂量',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aeacn3',
    comment: '药物暂停后又恢复',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aeacn4',
    comment: '停止用药',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aerel1',
    comment: '肯定有关',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aerel2',
    comment: '很可能有关',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aerel3',
    comment: '可能有关',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aerel4',
    comment: '可能无关',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$aerel5',
    comment: '肯定无关',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: '$sexdoseExdat',
    comment: '当前剂量的开始日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: '$eexdoseExdat',
    comment: '当前剂量的结束日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: '$exdoseExdat',
    comment: '用药天数',
    type: EFieldType.number,
    default: null,
  },

  // 需求上的固定字段
  {
    name: 'VS_visdat',
    comment: '访视日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: 'Rand_randarm',
    comment: '组别',
    type: EFieldType.string,
    default: null,
  },
  {
    name: 'DS_dsreas',
    comment: '提前退出原因',
    type: EFieldType.string,
    default: null,
  },
  {
    name: 'AE_dltyn',
    comment: '是否为剂量限制毒性',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: 'AE_aectc',
    comment: 'CTC分级',
    type: EFieldType.number,
    default: null,
  },
  {
    name: 'EX_exdat',
    comment: '给药日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: 'AE_aestdat',
    comment: '不良事件开始日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: 'AE_aeendat',
    comment: '不良事件结束日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: 'DS_dsdat',
    comment: '提前退出 完成日期',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: 'DS_status',
    comment: '受试者是否完成试验',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: 'AE_aeterm',
    comment: '不良事件名称',
    type: EFieldType.string,
    default: null,
  },
  {
    name: 'DM_icfdat',
    comment: '签署知情同意时间',
    type: EFieldType.timestamp,
    default: null,
  },
  {
    name: 'AE_saeyn',
    comment: '是否为严重不良事件',
    type: EFieldType.boolean,
    default: null,
  },
  {
    name: 'EX_exdose',
    comment: '给药剂量',
    type: EFieldType.string,
    default: null,
  },
  {
    name: 'EX_exfrq',
    comment: '给药频率',
    type: EFieldType.string,
    default: null,
  },
  {
    name: 'AE_aeacn',
    comment: '对试验用药采取的措施',
    type: EFieldType.string,
    default: null,
  },
];
