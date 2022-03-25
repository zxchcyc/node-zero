/*
 * @Author: archer zheng
 * @Date: 2020-07-29 16:06:44
 * @LastEditTime: 2022-03-24 17:49:20
 * @LastEditors: archer zheng
 * @Description: SmoothWeightedRoundRobin 平滑轮询算法
 * @FilePath: /node-zero/src/common/awesome/weighted-round/util-weighted-polling.service.ts
 */
import { Node } from './node';

interface ISelect {
  maxNode: Node;
  nodeList: Node[];
}

export class SmoothWeightedRoundRobin {
  // 保存权重
  constructor(private nodeList: Node[]) {}

  // 拿到加权分配队列 这里为什么要加锁？并发会有问题,单线程不需要
  // https://github.com/rogierschouten/async-lock/blob/master/lib/index.js
  public async select(): Promise<ISelect> {
    try {
      // 加锁
      return this.selectInner();
    } finally {
      // 释放锁
    }
  }

  // 拿到加权分配队列
  private selectInner(): ISelect {
    let totalWeight = 0;
    let maxNode: Node = null;
    let maxWeight = 0;

    for (const node of this.nodeList) {
      totalWeight += node.getWeight();

      // 每个节点的当前权重要加上原始的权重
      node.setCurrentWeight(node.getCurrentWeight() + node.getWeight());

      // 保存当前权重最大的节点
      if (maxNode == null || maxWeight < node.getCurrentWeight()) {
        maxNode = node;
        maxWeight = node.getCurrentWeight();
      }
    }

    // 被选中的节点权重减掉总权重
    maxNode.setCurrentWeight(maxNode.getCurrentWeight() - totalWeight);

    return { maxNode, nodeList: this.nodeList };
  }
}
