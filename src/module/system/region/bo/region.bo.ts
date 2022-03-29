import { PartialType } from '@nestjs/swagger';
import {
  RegionDto,
  FindRegionReqDto,
  FindRegionResDto,
} from '../dto/region.dto';

export class RegionBo extends RegionDto {}
export class FindRegionReqBo extends FindRegionReqDto {}
export class FindRegionResBo extends PartialType(FindRegionResDto) {}
