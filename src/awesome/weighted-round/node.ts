/*
 * @Author: archer zheng
 * @Date: 2020-07-29 16:06:44
 * @LastEditTime: 2022-03-24 17:48:31
 * @LastEditors: archer zheng
 * @Description: SmoothWeightedRoundRobin 平滑轮询算法
 * @FilePath: /node-zero/src/common/awesome/weighted-round/util-node.service.ts
 */

export class Node {
  private weight: number; // 初始权重 （保持不变）
  private nodeName: string; // 节点名称
  private currentWeight: number; // 当前权重
  constructor(nodeName: string, weight: number) {
    this.weight = weight;
    this.nodeName = nodeName;
    this.currentWeight = weight;
  }

  // 获取队列当前权重
  public getCurrentWeight(): number {
    return this.currentWeight;
  }

  // 获取队列初始权重
  public getWeight(): number {
    return this.weight;
  }

  // 设置队列当前权重
  public setCurrentWeight(currentWeight: number): void {
    this.currentWeight = currentWeight;
  }

  // 获取队列名称
  public getQueueName(): string {
    return this.nodeName;
  }
}
