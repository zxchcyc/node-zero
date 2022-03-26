import {
  FindTemplateReqBo,
  CreateTemplateReqBo,
  TemplateBo,
  FindOneTemplateResBo,
  UpdateTemplateReqBo,
  BatchDeleteReqBo,
  BatchUpdateReqBo,
  FindTemplateResBo,
} from '../bo/template.bo';

export abstract class TemplateAbstractFacadeService {
  abstract count(data: FindTemplateReqBo): Promise<number>;
  abstract find(data: FindTemplateReqBo): Promise<FindTemplateResBo[]>;
  abstract create(data: CreateTemplateReqBo): Promise<TemplateBo>;
  abstract findById(id: number): Promise<FindOneTemplateResBo>;
  abstract updateById(id: number, data: UpdateTemplateReqBo): Promise<void>;
  abstract batchDelete(data: BatchDeleteReqBo): Promise<void>;
  abstract batchUpdate(data: BatchUpdateReqBo): Promise<void>;
}
