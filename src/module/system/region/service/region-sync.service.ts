import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { RegionBo } from '../bo/region.bo';
import { REGIONS } from '../constant/pcas-code';
import { RegionAbstractRepoService } from '../repository/region.abstract';

@Injectable()
export class RegionSyncService extends BaseService {
  constructor(private readonly regionRepoService: RegionAbstractRepoService) {
    super(RegionSyncService.name);
  }

  /**
   * @description: 同步行政区域信息 https://github.com/modood/Administrative-divisions-of-China
   * @author: archer zheng
   */
  async sync() {
    const regions: RegionBo[] = [];
    for (const region of REGIONS) {
      regions.push(...this.subsetExpand(region));
    }
    await this.regionRepoService.createMany(regions);
    this.logger.debug(`同步行政区域信息，共 ${regions.length} 条`);
    this.logger.debug('结束同步行政区域信息');
  }

  subsetExpand(
    region: { code: string; name: string; children: any[] },
    pCode = this.envService.get('ROOT_REGION_CODE'),
    chain = this.envService.get('ROOT_REGION_CODE'),
  ) {
    const { name, code, children } = region;
    const regions: RegionBo[] = [];
    regions.push({
      name,
      code,
      pCode,
      chain,
      level: chain.split('_').length,
    });
    if (children?.length) {
      for (const child of children) {
        regions.push(...this.subsetExpand(child, code, `${chain}_${code}`));
      }
    }
    return regions;
  }
}
