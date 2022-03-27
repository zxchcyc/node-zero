import { EStatus } from 'src/common';

// 这个列表一般是后台动态配置
export const ROLE_LIST = [
  // 角色 管理员 大区 省区 区域
  {
    name: '管理员',
    code: 'admin',
    status: EStatus.enable,
    pgList: ['user', 'cms'],
  },
  {
    name: '大区',
    code: 'region',
    status: EStatus.enable,
    pgList: ['cms'],
  },
  {
    name: '省区',
    code: 'province',
    status: EStatus.enable,
    pgList: ['cms'],
  },
  {
    name: '区域',
    code: 'area',
    status: EStatus.enable,
    pgList: ['cms'],
  },
];
