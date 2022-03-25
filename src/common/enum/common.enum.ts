// 状态
export enum EStatus {
  // 启用
  'enable' = 1,
  //禁用
  'disable' = 2,
}

// 区分后台管理系统和业务系统
export enum ESystem {
  // 后台系统
  'admin' = 1,
  // 业务系统
  'business' = 2,
}

// 登录终端
export enum ELoginTerminal {
  'web' = 1,
  'mini' = 2,
}

// 登录站点
export enum ELoginWebSite {
  'da' = 1,
}

// 登录方式
export enum ELoginWay {
  // 密码
  'password' = 1,
  // 短信
  'message' = 2,
  // 小程序
  'mini' = 3,
}

// 登录状态
export enum ELoginStatus {
  // 成功
  'success' = 1,
  // 失败
  'failure' = 2,
}

// 状态说明
export enum ELoginDesc {
  // 成功
  'success' = 1,
  // 账号密码错误
  'accountPasswordError' = 2,
  // 账号被禁用
  'accountDisable' = 3,
}

// 验证码用途
export enum EVerifyCodeType {
  // 登录
  'login' = 1,
  // 忘记密码
  'forgetPassword' = 2,
  // 申请试用
  'apply' = 3,
  // 注册
  'reg' = 4,
  // 更改手机号
  'changePhone' = 5,
}

// 微信关联类型
export enum EWechatType {
  'mini' = 1,
  'public' = 2,
}

// 用户账号类型
export enum EUserType {
  'admin' = 1,
  'dealer' = 2,
}
