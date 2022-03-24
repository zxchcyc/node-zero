import { runInContext, createContext } from 'vm';
import * as ruleFunc from './function';

export class RuleEngine {
  constructor(private context: Record<string, any>, private code: string) {}
  public run() {
    const context = createContext({
      ...this.context,
      ...ruleFunc,
    });
    return runInContext(this.code, context);
  }
}
