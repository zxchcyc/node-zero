export enum EHttpErrorCode {
  // 系统错误码
  '00000' = '一切 ok',
  'A0001' = '用户端错误',
  'A0002' = '请求次数超过限制',
  'A0003' = '请联系管理员添加白名单',
  'A0004' = '获取不到客户端 IP',
  'A0005' = '未经授权',
  'A0006' = '请求参数校验出错',
  'A0008' = '没有权限操作',

  // 系统错误
  'B0001' = '系统执行出错',
  'B0100' = '系统执行超时',
  'B0101' = '数据库报错',
  'B0102' = '系统没有这个接口',
  'B0103' = '请求超时',

  // 第三方错误
  'C0001' = '调用第三方服务出错',
}
