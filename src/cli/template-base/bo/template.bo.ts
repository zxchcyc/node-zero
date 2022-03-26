import { PartialType } from '@nestjs/swagger';
import {
  TemplateDto,
  FindTemplateReqDto,
  FindTemplateResDto,
  CreateTemplateReqDto,
  FindOneTemplateResDto,
  UpdateTemplateReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/template.dto';

export class TemplateBo extends TemplateDto {}
export class FindTemplateReqBo extends FindTemplateReqDto {}
export class FindTemplateResBo extends PartialType(FindTemplateResDto) {}
export class CreateTemplateReqBo extends CreateTemplateReqDto {}
export class FindOneTemplateResBo extends FindOneTemplateResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateTemplateReqBo extends UpdateTemplateReqDto {
  pubAt?: Date;
}
