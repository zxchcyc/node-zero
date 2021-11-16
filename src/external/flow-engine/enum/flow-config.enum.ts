export enum EFlowNode {
  // 失活
  deactivated = 'deactivated',
  // 未采集
  savingBlank = 'savingBlank',
  // 未录入
  noEntry = 'noEntry',
  // 录入中
  entering = 'entering',
  // 已完成
  done = 'done',
  // 已核查
  verified = 'verified',
  // 已冻结
  freezed = 'freezed',
  // 已签名
  signed = 'signed',
  // 已锁库
  locked = 'locked',
}

export enum EFlowNodeName {
  // 失活
  deactivated = 'Deactivated',
  // 未采集
  savingBlank = 'SavingBlank',
  // 未录入
  noEntry = 'NoEntry',
  // 录入中
  entering = 'Entering',
  // 已完成
  done = 'Done',
  // 已核查
  verified = 'Verified',
  // 核查中
  verifying = 'Verifying',
  // 已冻结
  freezed = 'Freezed',
  // 已签名
  signed = 'Signed',
  // 已锁库
  locked = 'Locked',
}

export enum EFlowAction {
  // 失活
  deactivated = 'deactivated',
  // 未采集
  savingBlank = 'savingBlank',
  // 重新采集
  recapture = 'recapture',
  // 保存
  save = 'save',
  // 提交
  commit = 'commit',
  // SDV
  sdv = 'sdv',
  // 数据审核
  review = 'review',
  // 医学监查
  medicalReview = 'medicalReview',
  // 冻结
  freeze = 'freeze',
  // 签名
  signature = 'signature',
  // 锁库
  lock = 'lock',
}
