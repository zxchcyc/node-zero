import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { FindRegionReqBo, FindRegionResBo } from '../bo/region.bo';
import { RegionAbstractRepoService } from '../repository/region.abstract';

@Injectable()
export class RegionService extends BaseService {
  constructor(private readonly regionRepoService: RegionAbstractRepoService) {
    super(RegionService.name);
  }

  async count(data: FindRegionReqBo): Promise<number> {
    return this.regionRepoService.count(data);
  }

  async find(data: FindRegionReqBo): Promise<FindRegionResBo[]> {
    data.limit = null;
    const result = await this.regionRepoService.find(
      this._.omit(data, ['expand']),
    );
    if (!data.expand) {
      return result;
    }
    return result;
    // 递归生成树 性能问题不要全部放出去
    // const subset = (pCode: string) => {
    //   const childs = [];
    //   // 查询该pCode下的所有子集
    //   result.forEach((e) => {
    //     if (e.pCode === pCode) {
    //       childs.push(
    //         Object.assign(e, {
    //           childs: subset(e.code),
    //         }),
    //       );
    //     }
    //   });
    //   return childs;
    // };
    // return subset(this.envService.get('ROOT_REGION_CODE'));
  }
}
