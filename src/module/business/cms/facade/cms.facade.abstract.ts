import {
  FindCmsReqBo,
  CreateCmsReqBo,
  CmsBo,
  FindOneCmsResBo,
  UpdateCmsReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindCmsResBo,
} from '../bo/cms.bo';

export abstract class CmsAbstractFacadeService {
  abstract count(data: FindCmsReqBo): Promise<number>;
  abstract getPaging(data: FindCmsReqBo): Promise<FindCmsResBo[]>;
  abstract create(data: CreateCmsReqBo): Promise<CmsBo>;
  abstract findById(id: number): Promise<FindOneCmsResBo>;
  abstract updateById(id: number, data: UpdateCmsReqBo): Promise<void>;
  abstract batchDelete(data: BatchDeleteReqBo): Promise<void>;
  abstract batchUpdate(data: BatchUpdateReqBo): Promise<void>;
}
