// 状态
export enum ECrfStatus {
  // 启用
  'enable' = 'opened',
  //禁用
  'disable' = 'closed',
}

// 状态
export enum EStatus {
  // 启用
  'enable' = 1,
  //禁用
  'disable' = 2,
}

// 注意需要对齐EDC 控件类型
export enum EEdcFieldType {
  // 单行文本
  'SingleLineInput' = 'SingleLineInput',
  // 中文
  'ChineseInput' = 'ChineseInput',
  // Email
  'EmailInput' = 'EmailInput',
  // 大写
  'UppercaseInput' = 'UppercaseInput',
  // 多行文本
  'Textarea' = 'Textarea',
  // 日期
  'DateInput' = 'DateInput',
  // 数字
  'NumberInput' = 'NumberInput',
  // 动态表格
  'CycleTable' = 'CycleTable',
  // 实验室表格
  'LaboratoryTable' = 'LaboratoryTable',
  // 正常表格
  'NormalTable' = 'NormalTable',
  // 复选框
  'Checkbox' = 'Checkbox',
  // 单选框
  'Radio' = 'Radio',
  // 上传图片
  'Uploader' = 'Uploader',
  // 显示
  'Text' = 'Text',
  // 图像/媒体
  'Media' = 'Media',
}
