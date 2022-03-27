import {
  FindDeptReqBo,
  FindDeptResBo,
  FindOneDeptResBo,
  CreateDeptReqBo,
  DeptBo,
  UpdateDeptReqBo,
} from '../bo/dept.bo';

export abstract class DeptAbstractRepoService {
  abstract count(data: FindDeptReqBo): Promise<number>;
  abstract find(data: FindDeptReqBo): Promise<FindDeptResBo[]>;
  abstract findById(id: number): Promise<FindOneDeptResBo>;
  abstract create(data: CreateDeptReqBo): Promise<DeptBo>;
  abstract updateById(id: number, data: UpdateDeptReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
  abstract getChilds(train: string): Promise<FindDeptResBo[]>;
}
