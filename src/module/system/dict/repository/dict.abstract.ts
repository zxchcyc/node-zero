import {
  FindDictReqBo,
  FindDictResBo,
  FindOneDictResBo,
  CreateDictReqBo,
  DictBo,
  UpdateDictReqBo,
} from '../bo/dict.bo';

export abstract class DictAbstractRepoService {
  abstract count(data: FindDictReqBo): Promise<number>;
  abstract find(data: FindDictReqBo): Promise<FindDictResBo[]>;
  abstract findById(id: number): Promise<FindOneDictResBo>;
  abstract create(data: CreateDictReqBo): Promise<DictBo>;
  abstract updateById(id: number, data: UpdateDictReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
}
