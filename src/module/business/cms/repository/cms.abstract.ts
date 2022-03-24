import {
  FindCmsReqBo,
  FindCmsResBo,
  FindOneCmsResBo,
  CreateCmsReqBo,
  CmsBo,
  UpdateCmsReqBo,
} from '../bo/cms.bo';

export abstract class CmsAbstractRepoService {
  abstract count(data: FindCmsReqBo): Promise<number>;
  abstract find(data: FindCmsReqBo): Promise<FindCmsResBo[]>;
  abstract findById(id: number): Promise<FindOneCmsResBo>;
  abstract create(data: CreateCmsReqBo): Promise<CmsBo>;
  abstract updateById(id: number, data: UpdateCmsReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
}
