import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService, EStatus } from 'src/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  FindDeptReqBo,
  FindDeptResBo,
  FindOneDeptResBo,
  CreateDeptReqBo,
  DeptBo,
  UpdateDeptReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
} from '../bo/dept.bo';
import { DeptAbstractRepoService } from '../repository/dept.abstract';

@Injectable()
export class DeptService extends BaseService {
  constructor(private readonly deptRepoService: DeptAbstractRepoService) {
    super(DeptService.name);
  }

  async count(data: FindDeptReqBo): Promise<number> {
    return this.deptRepoService.count(data);
  }

  async find(data: FindDeptReqBo): Promise<FindDeptResBo[]> {
    const result = await this.deptRepoService.find(data);
    // 递归生成树
    return result;
  }

  async findById(id: number): Promise<FindOneDeptResBo> {
    const result = await this.deptRepoService.findById(id);
    return result;
  }

  async create(data: CreateDeptReqBo): Promise<DeptBo> {
    await this.computedChain(data);
    const result = await this.deptRepoService.create(data);
    return result;
  }

  async updateById(id: number, data: UpdateDeptReqBo): Promise<void> {
    // 更新状态的前提条件
    // 更新上级部门处理(刚需)
    const oldDept = await this.findById(id);
    if (!this._.isNil(data.pid) && data.pid !== oldDept.pid) {
      await this.computedChain(data);
    }
    const result = await this.deptRepoService.updateById(
      id,
      this._.omit(data, []),
    );
    if (!this._.isNil(data.pid) && data.pid !== oldDept.pid) {
      // 同步子部门数据 注意缓存（最好不要直接用SQL）
      await this.syncChildsChain(id, oldDept);
    }
    return result;
  }

  async deleteById(id: number): Promise<void> {
    // 删除的前提条件
    return await this.deptRepoService.deleteById(id);
  }

  @Transactional()
  async batchDelete(data: BatchDeleteReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) => ops.push(this.deleteById(id)));
    ops.length && (await Promise.all(ops));
    return;
  }

  @Transactional()
  async batchUpdate(data: BatchUpdateReqBo): Promise<void> {
    const { ids } = data;
    const ops = [];
    ids.forEach((id) =>
      ops.push(this.updateById(id, this._.pick(data, ['status']))),
    );
    ops.length && (await Promise.all(ops));
    return;
  }

  private async syncChildsChain(id: number, oldDept: FindOneDeptResBo) {
    const dept = await this.findById(id);
    const childs = await this.deptRepoService.getChilds(
      `${oldDept.chain}_${oldDept.id}`,
    );
    const ops = [];
    childs.forEach((e) => {
      const chain = e.chain.replace(oldDept.chain, dept.chain);
      ops.push(
        this.deptRepoService.updateById(e.id, {
          level: chain.split('_').length,
          chain,
        }),
      );
    });
    ops.length && (await Promise.all(ops));
  }

  /**
   * @description: 计算level和train字段
   * @param {CreateDeptReqBo} data
   * @author: archer zheng
   */
  private async computedChain(data: CreateDeptReqBo | UpdateDeptReqBo) {
    if (!data.pid) {
      data.pid = Number(this.envService.get('ROOT_DEPTID'));
      data.chain = String(data.pid);
      data.level = data.chain.split('_').length;
    } else {
      const pDept = await this.findById(data.pid);
      if (!pDept) {
        throw new BadRequestException('A0900');
      }
      data.chain = `${pDept.chain}_${String(data.pid)}`;
      data.level = data.chain.split('_').length;
    }
    return;
  }

  /**
   * @description: 获取所有上级部门ID
   * @param {number} id
   * @author: archer zheng
   */
  async getParentIds(id: number) {
    const dept = await this.findById(id);
    return dept.chain.split('_').map((e) => Number(e));
  }

  /**
   * @description: 获取所有下级部门ID
   * @param {number} id
   * @param {EStatus} status 过滤状态
   * @author: archer zheng
   */
  async getChildIds(id: number, status?: EStatus) {
    const dept = await this.findById(id);
    const childs = await this.deptRepoService.getChilds(
      `${dept.chain}_${dept.id}`,
    );
    if (status) {
      return childs.filter((e) => e.status === status).map((e) => Number(e.id));
    }
    return childs.map((e) => Number(e.id));
  }
}
