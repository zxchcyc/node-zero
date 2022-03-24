export interface IConfig {
  // 流程对象id
  // objid: string;
  // 当前节点
  cur: string;
  // 当前节点前端显示名称
  curName: string;

  // 前一个节点
  pre: string;
  // 通往前一个节点支持的动作 'sdv' 'review' 'mr'
  preAction: string[];
  // 当前节点通往上一个节点时，处于并发状态中前端显示名称
  preIngName?: string;
  // 当前节点通往前一个节点时，并发动作要求
  preRequire?: {
    // 最少完成动作数 3
    count?: number;
    // 必须完成的动作
    action?: string[];
  };

  // 下一个节点
  next: string;
  // 通往下一个节点支持的动作 'sdv' 'review' 'mr'
  nextAction: string[];
  // 当前节点通往下个节点时，处于并发状态中前端显示名称
  nextIngName?: string;
  // 当前节点通往下个节点时，并发动作要求
  nextRequire?: {
    // 最少完成动作数 3
    count?: number;
    // 必须完成的动作
    action?: string[];
  };
}

export interface ITrace {
  // 动作
  action: string;
  // 当前节点
  cur: string;
}

export enum EDirection {
  // 向前
  next = 'next',
  // 向后
  pre = 'pre',
}

// 轻量级流程引擎实现
// 约定 节点+动作 唯一 也就是说在某个节点上做某个动作只能去到唯一的节点
// 开始节点和结束节点业务控制
export class FlowEngine {
  // 标识回退动作是否属于并发节点回退动作
  private preConcurrent = true;
  constructor(
    private configs: IConfig[],
    private cur: string,
    private traces: ITrace[],
  ) {
    // configs 合法性检测
  }

  /**
   * 检查动作是否允许
   * @param action 执行的动作
   * @param done 确定或者取消
   */
  private checkAction(action: string, done: boolean): boolean {
    let allow = false;
    if (done) {
      allow = this.nextAction().includes(action);
    } else {
      allow = this.preAction().includes(action);
    }
    if (!allow) {
      throw Error('不允许该操作');
    }
    return allow;
  }

  /**
   * 维护栈信息
   * @param action 执行的动作
   * @param done 确定或者取消
   */
  private maintainTrace(action: string, done: boolean) {
    if (done) {
      // 确认动作入栈 哪个节点哪个动作
      this.traces.push({
        action,
        cur: this.cur,
      });
    } else {
      // 取消动作出栈 哪个节点哪个动作
      if (this.preConcurrent) {
        const tracesMap = this.traces.map((e) => `${e.action}-${e.cur}`);
        const index = tracesMap.lastIndexOf(`${action}-${this.cur}`);
        if (index !== -1) {
          this.traces.splice(index, 1);
        }
      } else {
        this.traces.pop();
      }
    }
    return;
  }

  /**
   * 判断执行完动作处于哪个节点上
   * @param action 执行的动作
   * @param done 确定或者取消
   * @return config
   */
  private runAction(action: string, done: boolean): IConfig {
    const traces = [...this.traces];

    let config: IConfig;
    if (done) {
      [config] = this.configs.filter(
        (e) => e.cur === this.cur && e.nextAction.includes(action),
      );
      const require = config.nextRequire;
      if (require && !this.checkRequire(require)) {
        // ingName 处理
        config.curName = config.nextIngName;
        return config;
      }
      // 可能存在多个 只需要返回一个
      [config] = this.configs.filter((e) => e.cur === config.next);
      // 重置当前节点位置
      this.cur = config.cur;
    } else {
      const trace = traces.pop();
      // ? 处理空的情况
      if (trace?.cur !== this.cur && !this.preConcurrent) {
        [config] = this.configs.filter(
          (e) => e.cur === this.cur && e.preAction.includes(action),
        );
        const require = config.preRequire;
        if (require && !this.checkRequire(require, config.preAction)) {
          // ingName 处理
          config.curName = config.preIngName;
          return config;
        }
        // 节点可能存在多个配置 只需要返回一个
        [config] = this.configs.filter((e) => e.cur === config.pre);
        // 重置当前节点位置
        this.cur = config.cur;
      } else {
        [config] = this.configs.filter((e) => e.cur === this.cur);
        if (trace?.cur === this.cur) {
          // 并发进度没有退完
          // ingName 处理
          config.curName = config.nextIngName;
        }
      }
    }

    return config;
  }

  /**
   * 并发节点检测
   * @param require 并发节点要求
   * @param preAction 通往前一个节点支持的动作
   * @return boolean
   */
  private checkRequire(
    require: {
      count?: number;
      action?: string[];
    },
    preAction?: string[],
  ): boolean {
    const traces = [...this.traces];
    // 节点存在并发动作
    // 找到栈顶同类型元素
    const curTraceActionSet = new Set<string>();
    let trace: ITrace;
    do {
      trace = traces.pop();
      if (trace.cur === this.cur) {
        curTraceActionSet.add(trace.action);
      }
    } while (trace.cur === this.cur && traces.length);
    // 完成的数量是否满足
    let countPass = false;
    if (require.count && preAction?.length) {
      countPass = preAction.length - curTraceActionSet.size >= require.count;
    } else if (require.count) {
      countPass = curTraceActionSet.size >= require.count;
    } else {
      countPass = true;
    }
    // 完成的动作是否满足
    let actionPass = false;
    if (require.action && preAction?.length) {
      actionPass = require.action.every((a) => !curTraceActionSet.has(a));
    } else if (require.action) {
      actionPass = require.action.every((a) => curTraceActionSet.has(a));
    } else {
      actionPass = true;
    }
    return countPass && actionPass;
  }

  /**
   * 执行动作 由业务解决并发问题
   * @param action 执行的动作
   * @param direction 流程方向 'next' 'pre'
   * @return {
   * cur: string; 执行完动作处于哪个节点
   * curName: string; 节点名称
   * traces: ITrace; 栈信息
   * }
   */
  public run(
    action: string,
    direction = EDirection.next,
  ): { cur: string; curName: string; traces: ITrace[] } {
    let done = true;
    if (direction === EDirection.pre) {
      done = false;
    }
    // 判断节点是否支持该动作 下一个节点可能有多个
    this.checkAction(action, done);

    // 维护栈信息
    this.maintainTrace(action, done);

    // 判断执行完动作处于哪个节点上
    const config = this.runAction(action, done);

    return {
      cur: this.cur,
      curName: config.curName,
      traces: this.traces,
    };
  }

  /**
   * 支持取消的动作
   */
  public preAction(): string[] {
    const traces = [...this.traces];
    const preActionsMap = new Map<string, boolean>();
    let traceTop: ITrace;

    // 取消动作也需要看trace栈顶同节点同类型的动作是否有包含
    if (traces.length) {
      let trace: ITrace;
      do {
        trace = traces.pop();
        traceTop = Object.assign({}, trace);
        if (trace.cur === this.cur) {
          preActionsMap.set(trace.action, true);
        }
      } while (trace.cur === this.cur && traces.length);
    }
    this.preConcurrent = true;

    // 不存在并发进度
    if (!preActionsMap.size) {
      this.preConcurrent = false;
      // 判断节点是否支持该动作 上一个节点可能有多个
      const configs = this.configs.filter(
        (e) => e.cur === this.cur && e.preAction.includes(traceTop?.action),
      );
      configs.map((config) =>
        config.preAction.map((e) => preActionsMap.set(e, true)),
      );
    }
    return [...preActionsMap.keys()];
  }

  /**
   * 支持确定的动作
   */
  public nextAction(): string[] {
    // 判断节点是否支持该动作 下一个节点可能有多个
    const traces = [...this.traces];
    const configs = this.configs.filter((e) => e.cur === this.cur);
    // 确认动作只需要看nextAction
    const nextActionsMap = new Map<string, boolean>();
    configs.map((config) =>
      config.nextAction?.map((e) => nextActionsMap.set(e, true)),
    );
    // 确认动作也需要看trace栈顶同节点同类型的动作是否没有包含
    if (traces.length) {
      let trace: ITrace;
      do {
        trace = traces.pop();
        if (trace.cur === this.cur) {
          nextActionsMap.delete(trace.action);
        }
      } while (trace.cur === this.cur && traces.length);
    }

    return [...nextActionsMap.keys()];
  }
}
