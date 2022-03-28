import { EStatus } from 'src/common';

// 这个列表一般是后台动态配置
export const ROLE_LIST = [
  // 角色 管理员
  {
    name: '管理员',
    code: 'admin',
    status: EStatus.enable,
    pgList: ['账号管理', '角色管理', '部门管理'],
  },
];
