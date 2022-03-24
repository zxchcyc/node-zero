import { PartialType } from '@nestjs/swagger';
import {
  CmsDto,
  FindCmsReqDto,
  FindCmsResDto,
  CreateCmsReqDto,
  FindOneCmsResDto,
  UpdateCmsReqDto,
  BatchUpdateReqDto,
  BatchDeleteReqDto,
} from '../dto/cms.dto';

export class CmsBo extends CmsDto {}
export class FindCmsReqBo extends FindCmsReqDto {}
export class FindCmsResBo extends PartialType(FindCmsResDto) {}
export class CreateCmsReqBo extends CreateCmsReqDto {}
export class FindOneCmsResBo extends FindOneCmsResDto {}
export class BatchUpdateReqBo extends BatchUpdateReqDto {}
export class BatchDeleteReqBo extends BatchDeleteReqDto {}
export class UpdateCmsReqBo extends UpdateCmsReqDto {
  pubAt?: Date;
}
