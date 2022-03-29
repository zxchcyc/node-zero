import { FindRegionReqBo, FindRegionResBo, RegionBo } from '../bo/region.bo';

export abstract class RegionAbstractRepoService {
  abstract count(data: FindRegionReqBo): Promise<number>;
  abstract find(data: FindRegionReqBo): Promise<FindRegionResBo[]>;
  abstract create(data: RegionBo): Promise<RegionBo>;
  abstract createMany(data: RegionBo[]): Promise<void>;
}
