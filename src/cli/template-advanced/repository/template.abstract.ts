import {
  FindTemplateReqBo,
  FindTemplateResBo,
  FindOneTemplateResBo,
  CreateTemplateReqBo,
  TemplateBo,
  UpdateTemplateReqBo,
} from '../bo/template.bo';

export abstract class TemplateAbstractRepoService {
  abstract count(data: FindTemplateReqBo): Promise<number>;
  abstract find(data: FindTemplateReqBo): Promise<FindTemplateResBo[]>;
  abstract findById(id: number): Promise<FindOneTemplateResBo>;
  abstract create(data: CreateTemplateReqBo): Promise<TemplateBo>;
  abstract updateById(id: number, data: UpdateTemplateReqBo): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
}
