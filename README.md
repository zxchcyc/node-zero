# 说明
## 功能
- [x] 登录/认证
- [x] 用户
- [x] 角色/授权
- [x] 部门

## 框架图

![框架图](./docs/框架图.svg)

## 设计原则
### 可扩展性基本要求
- 可重构 业务层代码可测试
- MQ DB 等中间件可以在不动业务代码的前提下更换（实现适配器）
  
### 可扩展性高级要求
- 服务间(nestjs 里面体现为模块)互调，屏蔽远程调用和本地调用细节
- 可复用 流程引擎 模块引擎 规则引擎 等通用能力抽象出来

### 单机高性能基本要求
- 网络模型
- 进程模型
- 缓存
- 队列

### 单机高性能高级要求
- 流处理

### 集群高性能基本要求
- 批处理
- map-reduce 支持

### 集群高性能高级要求


### 集群高可用基本要求

### 集群高可用高级要求


## 开发体验

### 提供代码生成器（处理复制粘贴问题）
```node dist/cli/index.js -m user```
### DTO BO PO 转换问题
```使用继承```
### typeORM 不支持参数校验 
```使用 class-validator```
### 3月3号19点19分00秒
```@Cron('00 19 19 03 02 *')  ```

## 安全问题