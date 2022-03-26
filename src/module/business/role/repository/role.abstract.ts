import {
  FindRoleReqBo,
  FindRoleResBo,
  FindOneRoleResBo,
  CreateRoleReqBo,
  RoleBo,
  UpdateRoleReqBo,
} from '../bo/role.bo';

export abstract class RoleAbstractRepoService {
  abstract count(data: FindRoleReqBo): Promise<number>;
  abstract find(data: FindRoleReqBo): Promise<FindRoleResBo[]>;
  abstract findById(id: number): Promise<FindOneRoleResBo>;
  abstract create(data: CreateRoleReqBo): Promise<RoleBo>;
  abstract updateById(id: number, data: UpdateRoleReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
}
